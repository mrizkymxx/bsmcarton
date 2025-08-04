
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  where,
  getDoc,
  deleteDoc,
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
        const availableToShip = item.produced - delivered;
        
        // **FIX:** Only include items that have a quantity > 0 available to ship.
        if (availableToShip > 0) {
          items.push({
            ...item,
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
    const deliveryData = {
      ...data,
      deliveryDate: new Date(data.deliveryDate),
      // Ensure all item fields are included
      items: data.items.map(item => ({
        poId: item.poId,
        orderItemId: item.orderItemId,
        name: item.name,
        poNumber: item.poNumber,
        quantity: item.quantity,
        type: item.type,
        finishedSize: item.finishedSize,
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
      let isPoCompleted = true; // Assume PO will be completed

      // Update items within the PO
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
      
      // Check if all items in the PO are now fully delivered
      for (const item of updatedItems) {
        if ((item.delivered || 0) < item.total) {
          isPoCompleted = false;
          break;
        }
      }

      // 4. Batch the PO update
      batch.update(poRef, { 
        items: updatedItems,
        status: isPoCompleted ? 'Completed' : 'Open' 
      });
    }

    // 5. Commit all batched writes
    await batch.commit();

    // 6. Revalidate paths
    revalidatePath("/deliveries");
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating delivery: ", error);
    throw new Error("Failed to create delivery note.");
  }
}

// DELETE
export async function deleteDelivery(id: string) {
  const batch = writeBatch(db);
  const deliveryRef = doc(db, "deliveries", id);

  try {
    // 1. Get the delivery document to know what to roll back
    const deliveryDoc = await getDoc(deliveryRef);
    if (!deliveryDoc.exists()) {
      throw new Error("Surat Jalan tidak ditemukan.");
    }
    const deliveryData = deliveryDoc.data() as Delivery;

    // 2. Group items by their PO to minimize reads
    const itemsByPo = deliveryData.items.reduce((acc, item) => {
      acc[item.poId] = acc[item.poId] || [];
      acc[item.poId].push(item);
      return acc;
    }, {} as Record<string, typeof deliveryData.items>);


    // 3. Update each affected Purchase Order
    for (const poId in itemsByPo) {
      const poRef = doc(db, "purchase_orders", poId);
      const poDoc = await getDoc(poRef);
      if (!poDoc.exists()) {
        console.warn(`Purchase Order with ID ${poId} not found during deletion. Skipping.`);
        continue;
      }

      const poData = poDoc.data() as PurchaseOrder;
      const updatedItems = [...poData.items];

      // Subtract the delivered quantity for each item in the deleted delivery
      itemsByPo[poId].forEach((deliveryItem) => {
        const itemIndex = updatedItems.findIndex(
          (item) => item.id === deliveryItem.orderItemId
        );

        if (itemIndex > -1) {
          const item = updatedItems[itemIndex];
          item.delivered = (item.delivered || 0) - deliveryItem.quantity;
          if (item.delivered < 0) item.delivered = 0; // Prevent negative values

          // Re-evaluate status
          if (item.produced >= item.total) {
              item.status = 'Siap Kirim';
          } else if (item.produced > item.delivered) {
              item.status = 'Diproduksi';
          }
        }
      });

      // The PO status must be 'Open' if we are deleting a delivery
      batch.update(poRef, { 
        items: updatedItems,
        status: 'Open'
      });
    }

    // 4. Delete the actual delivery document
    batch.delete(deliveryRef);

    // 5. Commit all batched writes
    await batch.commit();

    // 6. Revalidate paths
    revalidatePath("/deliveries");
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting delivery: ", error);
    throw new Error("Gagal menghapus Surat Jalan.");
  }
}
