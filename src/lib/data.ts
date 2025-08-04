import type { Customer, PurchaseOrder } from "./types";

export const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "PT. Maju Jaya",
    email: "contact@majujaya.co.id",
    phone: "081234567890",
    address: "Jl. Industri No. 1, Jakarta",
    registered: "2023-01-15T09:30:00Z",
  },
  {
    id: "CUST-002",
    name: "CV. Abadi Sejahtera",
    email: "order@abadisejahtera.com",
    phone: "081298765432",
    address: "Jl. Raya Serang No. 25, Banten",
    registered: "2023-02-20T14:00:00Z",
  },
  {
    id: "CUST-003",
    name: "Toko Berkah",
    email: "tokoberkah@gmail.com",
    phone: "085611223344",
    address: "Jl. Pahlawan No. 3, Bandung",
    registered: "2023-03-10T11:45:00Z",
  },
    {
    id: "CUST-004",
    name: "PT. Cipta Kreasi",
    email: "info@ciptakreasi.id",
    phone: "087788990011",
    address: "Kawasan Industri MM2100, Bekasi",
    registered: "2023-04-05T16:20:00Z",
  },
  {
    id: "CUST-005",
    name: "Warung Sembako Ibu Siti",
    email: "ibusiti@yahoo.com",
    phone: "081123456789",
    address: "Jl. Desa No. 10, Bogor",
    registered: "2023-05-22T08:00:00Z",
  },
];

// This is now fetched from Firestore
export const purchaseOrders: PurchaseOrder[] = [];

export const recentPOs = purchaseOrders.slice(0, 5);
