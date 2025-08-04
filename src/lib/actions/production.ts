
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
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { OrderItemStatus, ProductionItem, PurchaseOrder } from "../types";

const poCollection = collection(db, "purchase_orders");

// READ Production Items
export async function getProductionItems(): Promise<ProductionItem[]> {
  try {
    const q = query(poCollection, where("status", "==", "Open"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const productionItems: ProductionItem[] = [];
    snapshot.docs.forEach((doc) => {
      const po = doc.data() as Omit<PurchaseOrder, "id">;
      po.items.forEach((item) => {
        // Only include items that are not fully delivered
        if ((item.delivered || 0) < item.total) {
            productionItems.push({
            ...item,
            poId: doc.id,
            poNumber: po.poNumber,
            customerName: po.customerName,
            orderDate: (po.orderDate as any)?.toDate ? (po.orderDate as any).toDate().toISOString() : po.orderDate,
          });
        }
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
  newStatus: OrderItemStatus
) {
  const poRef = doc(db, "purchase_orders", poId);
  try {
    const poSnapshot = await getDoc(poRef);

    if (!poSnapshot.exists()) {
        throw new Error("Purchase Order not found.");
    }

    const poData = poSnapshot.data() as PurchaseOrder;
    const itemIndex = poData.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error("Item not found in Purchase Order.");
    }
    
    const updatedItems = [...poData.items];
    const currentItem = updatedItems[itemIndex];

    currentItem.produced = newProduced;
    currentItem.status = newStatus;

    // Auto-update status based on production
    if (currentItem.produced >= currentItem.total) {
        currentItem.status = 'Siap Kirim';
    } else if (currentItem.produced > (currentItem.delivered || 0)) {
        currentItem.status = 'Diproduksi';
    }

    await updateDoc(poRef, { items: updatedItems });

    // Revalidate paths to refresh data on relevant pages
    revalidatePath("/production");
    revalidatePath("/purchase-orders");
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating production item: ", error);
    throw new Error("Failed to update production item.");
  }
}
