
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  writeBatch,
  where,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { Delivery, PurchaseOrder, ReadyToShipItem } from "../types";

const deliveriesCollection = collection(db, "deliveries");
const poCollection = collection(db, "purchase_orders");

// READ Deliveries
export async function getDeliveries(): Promise<Delivery[]> {
  try {
    const q = query(deliveriesCollection, orderBy("deliveryDate", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const deliveries: Delivery[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        deliveryNoteNumber: data.deliveryNoteNumber,
        customerName: data.customerName,
        customerId: data.customerId,
        deliveryDate: (data.deliveryDate as Timestamp)
          ?.toDate()
          ?.toISOString(),
        items: data.items || [],
        expedition: data.expedition,
        vehicleNumber: data.vehicleNumber,
        driverName: data.driverName,
      };
    });

    return deliveries;
  } catch (error) {
    console.error("Error fetching deliveries: ", error);
    throw new Error("Failed to fetch deliveries from Firestore.");
  }
}

// READ Items that are ready to be shipped for a specific customer
export async function getReadyToShipItems(
  customerId: string
): Promise<ReadyToShipItem[]> {
  if (!customerId) return [];

  try {
    const q = query(
      poCollection,
      where("customerId", "==", customerId),
      where("status", "==", "Open")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const items: ReadyToShipItem[] = [];
    snapshot.docs.forEach((doc) => {
      const po = doc.data() as Omit<PurchaseOrder, "id" | "items"> & { items: any[] };
      po.items.forEach((item) => {
        const delivered = item.delivered || 0;
        const produced = item.produced || 0;
        const availableToShip = produced - delivered;
        
        // **CRITICAL FIX**: Only return items that are ready AND have stock > 0
        if (item.status === 'Siap Kirim' && availableToShip > 0) {
          items.push({
            ...item,
            id: item.id,
            poId: doc.id,
            poNumber: po.poNumber,
            customerName: po.customerName,
            orderDate: (po.orderDate as any)?.toDate
              ? (po.orderDate as any).toDate().toISOString()
              : po.orderDate,
            availableToShip: availableToShip,
          });
        }
      });
    });

    return items;
  } catch (error) {
    console.error("Error fetching ready-to-ship items: ", error);
    throw new Error("Failed to fetch ready-to-ship items.");
  }
}

// CREATE Delivery Note and UPDATE related PO items
export async function createDelivery(data: Omit<Delivery, "id">) {
  const batch = writeBatch(db);

  try {
    // 1. Create the new delivery note document
    // **CRITICAL FIX**: Ensure all required fields from the form are saved.
    const deliveryData = {
      ...data,
      deliveryDate: new Date(data.deliveryDate),
      items: data.items.map(item => ({
        poId: item.poId,
        orderItemId: item.orderItemId,
        name: item.name,
        poNumber: item.poNumber,
        quantity: item.quantity,
        type: item.type,
        finishedSize: item.finishedSize || null, // Handle potentially missing size
      })),
    };
    const deliveryRef = doc(collection(db, "deliveries"));
    batch.set(deliveryRef, deliveryData);

    // 2. Group items by their PO
    const itemsByPo = data.items.reduce((acc, item) => {
      acc[item.poId] = acc[item.poId] || [];
      acc[item.poId].push(item);
      return acc;
    }, {} as Record<string, typeof data.items>);

    // 3. Update each Purchase Order
    for (const poId in itemsByPo) {
      const poRef = doc(db, "purchase_orders", poId);
      const poDoc = await getDoc(poRef);
      if (!poDoc.exists()) {
        throw new Error(`Purchase Order with ID ${poId} not found.`);
      }

      const poData = poDoc.data() as PurchaseOrder;
      const updatedItems = [...poData.items];
      let isPoCompleted = true;

      itemsByPo[poId].forEach((deliveryItem) => {
        const itemIndex = updatedItems.findIndex(
          (item) => item.id === deliveryItem.orderItemId
        );
        if (itemIndex > -1) {
          const item = updatedItems[itemIndex];
          item.delivered = (item.delivered || 0) + deliveryItem.quantity;
          
          if (item.delivered >= item.total) {
            item.status = 'Dikirim';
          }
        }
      });
      
      for (const item of updatedItems) {
        if ((item.delivered || 0) < item.total) {
          isPoCompleted = false;
          break;
        }
      }

      batch.update(poRef, { 
        items: updatedItems,
        status: isPoCompleted ? 'Completed' : 'Open' 
      });
    }

    await batch.commit();

    revalidatePath("/deliveries");
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating delivery: ", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create delivery note.");
  }
}


// DELETE
export async function deleteDelivery(id: string) {
  const batch = writeBatch(db);
  const deliveryRef = doc(db, "deliveries", id);

  try {
    const deliveryDoc = await getDoc(deliveryRef);
    if (!deliveryDoc.exists()) {
      throw new Error("Surat Jalan tidak ditemukan.");
    }
    const deliveryData = deliveryDoc.data() as Delivery;

    const itemsByPo = deliveryData.items.reduce((acc, item) => {
      acc[item.poId] = acc[item.poId] || [];
      acc[item.poId].push(item);
      return acc;
    }, {} as Record<string, typeof deliveryData.items>);

    for (const poId in itemsByPo) {
      const poRef = doc(db, "purchase_orders", poId);
      const poDoc = await getDoc(poRef);
      if (!poDoc.exists()) {
        console.warn(`Purchase Order with ID ${poId} not found during deletion. Skipping.`);
        continue;
      }

      const poData = poDoc.data() as PurchaseOrder;
      const updatedItems = [...poData.items];

      itemsByPo[poId].forEach((deliveryItem) => {
        const itemIndex = updatedItems.findIndex(
          (item) => item.id === deliveryItem.orderItemId
        );

        if (itemIndex > -1) {
          const item = updatedItems[itemIndex];
          const originalDelivered = item.delivered || 0;
          item.delivered = originalDelivered - deliveryItem.quantity;
          if (item.delivered < 0) item.delivered = 0;

          // If item is now not fully delivered, revert status
          if ((item.produced || 0) > item.delivered) {
             item.status = 'Siap Kirim';
          }
        }
      });
      
      // A PO that was 'Completed' might now be 'Open' again
      batch.update(poRef, { 
        items: updatedItems,
        status: 'Open'
      });
    }

    batch.delete(deliveryRef);

    await batch.commit();

    revalidatePath("/deliveries");
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting delivery: ", error);
    throw new Error(error instanceof Error ? error.message : "Gagal menghapus Surat Jalan.");
  }
}

    