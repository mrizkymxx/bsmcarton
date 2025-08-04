
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { ProductionItem, PurchaseOrder } from "../types";

const poCollection = collection(db, "purchase_orders");

// READ Production Items
export async function getProductionItems(): Promise<ProductionItem[]> {
  try {
    const q = query(poCollection, where("status", "==", "Open"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No open purchase orders found.");
      return [];
    }

    const productionItems: ProductionItem[] = [];
    snapshot.docs.forEach((doc) => {
      const po = doc.data() as Omit<PurchaseOrder, "id">;
      po.items.forEach((item) => {
        productionItems.push({
          ...item,
          poId: doc.id,
          poNumber: po.poNumber,
          customerName: po.customerName,
          orderDate: (po.orderDate as any)?.toDate ? (po.orderDate as any).toDate().toISOString() : po.orderDate,
        });
      });
    });

    // Sort items by order date, descending
    productionItems.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    return productionItems;
  } catch (error) {
    console.error("Error fetching production items: ", error);
    throw new Error("Failed to fetch production items from Firestore.");
  }
}

// UPDATE Production Item Status and Quantity
export async function updateProductionItem(
  poId: string,
  itemId: string,
  newProduced: number,
  newStatus: 'Draft' | 'Diproduksi' | 'Siap Kirim' | 'Dikirim'
) {
  try {
    const poRef = doc(db, "purchase_orders", poId);
    const poSnapshot = await getDocs(query(collection(db, "purchase_orders"), where("__name__", "==", poId)));

    if (poSnapshot.empty) {
        throw new Error("Purchase Order not found.");
    }

    const poData = poSnapshot.docs[0].data() as PurchaseOrder;
    const itemIndex = poData.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error("Item not found in Purchase Order.");
    }
    
    const updatedItems = [...poData.items];
    const currentItem = updatedItems[itemIndex];

    currentItem.produced = newProduced;
    currentItem.status = newStatus;

    // Optional: Auto-complete item if production is done
    if (currentItem.produced >= currentItem.total) {
        currentItem.status = 'Siap Kirim';
    }

    await updateDoc(poRef, { items: updatedItems });

    // Optional: Auto-complete PO if all items are ready
    const allItemsReady = updatedItems.every(item => item.status === 'Siap Kirim' || item.status === 'Dikirim');
    if (allItemsReady) {
        await updateDoc(poRef, { status: 'Completed' });
    }


    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating production item: ", error);
    throw new Error("Failed to update production item.");
  }
}
