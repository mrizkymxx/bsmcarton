
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { PurchaseOrder } from "../types";

const poCollection = collection(db, "purchase_orders");

// READ
export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const q = query(poCollection, orderBy("orderDate", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("No purchase orders found.");
      return [];
    }

    const purchaseOrders: PurchaseOrder[] = snapshot.docs.map((doc) => {
       const data = doc.data();
       return {
         id: doc.id,
         poNumber: data.poNumber,
         customerName: data.customerName,
         customerId: data.customerId,
         orderDate: (data.orderDate as Timestamp)?.toDate()?.toISOString() || new Date().toISOString(),
         status: data.status,
         items: data.items || [], // Ensure items is always an array
       }
    });

    return purchaseOrders;
  } catch (error) {
    console.error("Error fetching purchase orders: ", error);
    throw new Error("Failed to fetch purchase orders from Firestore.");
  }
}

// CREATE & UPDATE (Upsert)
export async function upsertPurchaseOrder(
  id: string | null,
  data: Omit<PurchaseOrder, "id">
) {
  try {
    const { orderDate, ...restData } = data;
    // Firestore expects a Date object for Timestamp fields
    const dataToSave: any = {
      ...restData,
      orderDate: orderDate ? new Date(orderDate) : serverTimestamp(),
    };

    if (id) {
      // Update existing PO
      const poDoc = doc(db, "purchase_orders", id);
      await updateDoc(poDoc, dataToSave);
    } else {
      // Create new PO
      await addDoc(poCollection, dataToSave);
    }
    revalidatePath("/purchase-orders");
    revalidatePath("/"); // Also revalidate dashboard for recent POs
  } catch (error) {
    console.error("Error upserting purchase order: ", error);
    throw new Error("Failed to save purchase order data.");
  }
}

// DELETE
export async function deletePurchaseOrder(id: string) {
  try {
    const poDoc = doc(db, "purchase_orders", id);
    await deleteDoc(poDoc);
    revalidatePath("/purchase-orders");
     revalidatePath("/");
  } catch (error) {
    console.error("Error deleting purchase order: ", error);
    throw new Error("Failed to delete purchase order.");
  }
}
