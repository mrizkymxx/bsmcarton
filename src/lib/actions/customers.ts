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
} from "firebase/firestore";
import { Customer } from "../types";

const customersCollection = collection(db, "customers");

// READ
export async function getCustomers(): Promise<Customer[]> {
  try {
    const q = query(customersCollection, orderBy("registered", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("No customers found.");
      return [];
    }

    const customers: Customer[] = snapshot.docs.map((doc) => {
       const data = doc.data();
       return {
         id: doc.id,
         name: data.name,
         email: data.email,
         phone: data.phone,
         address: data.address,
         registered: data.registered?.toDate()?.toISOString() || new Date().toISOString(),
       }
    });

    return customers;
  } catch (error) {
    console.error("Error fetching customers: ", error);
    throw new Error("Failed to fetch customers from Firestore.");
  }
}

// CREATE & UPDATE (Upsert)
export async function upsertCustomer(
  id: string | null,
  data: Omit<Customer, "id" | "registered">
) {
  try {
    if (id) {
      // Update existing customer
      const customerDoc = doc(db, "customers", id);
      await updateDoc(customerDoc, data);
    } else {
      // Create new customer
      await addDoc(customersCollection, {
        ...data,
        registered: serverTimestamp(),
      });
    }
    revalidatePath("/customers");
  } catch (error) {
    console.error("Error upserting customer: ", error);
    throw new Error("Failed to save customer data.");
  }
}

// DELETE
export async function deleteCustomer(id: string) {
  try {
    const customerDoc = doc(db, "customers", id);
    await deleteDoc(customerDoc);
    revalidatePath("/customers");
  } catch (error) {
    console.error("Error deleting customer: ", error);
    throw new Error("Failed to delete customer.");
  }
}
