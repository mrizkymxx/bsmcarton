
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
    // Query all purchase orders, not just "Open" ones.
    const q = query(poCollection);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const productionItems: ProductionItem[] = [];
    snapshot.docs.forEach((doc) => {
      const poData = doc.data();
      const po = {
        ...poData,
        orderDate: poData.orderDate instanceof Timestamp ? poData.orderDate.toDate().toISOString() : poData.orderDate,
      } as Omit<PurchaseOrder, "id">;
      
      po.items.forEach((item) => {
        productionItems.push({
          ...item,
          poId: doc.id,
          poNumber: po.poNumber,
          customerName: po.customerName,
          orderDate: po.orderDate,
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
    
    // Auto-update status based on production
    // This logic is now primarily visual on the frontend, but we keep a base status here.
    if (newStatus) {
       currentItem.status = newStatus;
    } else if (currentItem.produced >= currentItem.total) {
        currentItem.status = 'Ready to Ship';
    } else if (currentItem.produced > (currentItem.delivered || 0)) {
        currentItem.status = 'In Production';
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
