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

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    customerId: "CUST-001",
    customerName: "PT. Maju Jaya",
    poNumber: "PO/MJ/2024/001",
    orderDate: "2024-05-01T10:00:00Z",
    status: "Completed",
    items: [
      {
        id: "ITEM-001-A",
        name: "Kardus Ukuran A",
        materialSize: { length: 50, width: 40 },
        finishedSize: { length: 25, width: 20, height: 10 },
        total: 1000,
        produced: 1000,
        status: "Dikirim",
      },
      {
        id: "ITEM-001-B",
        name: "Kardus Ukuran B",
        materialSize: { length: 80, width: 60 },
        finishedSize: { length: 40, width: 30, height: 20 },
        total: 500,
        produced: 500,
        status: "Dikirim",
      },
    ],
  },
  {
    id: "PO-002",
    customerId: "CUST-002",
    customerName: "CV. Abadi Sejahtera",
    poNumber: "PO/AS/2024/005",
    orderDate: "2024-05-15T13:20:00Z",
    status: "Open",
    items: [
      {
        id: "ITEM-002-A",
        name: "Kardus Sepatu",
        materialSize: { length: 65, width: 45 },
        finishedSize: { length: 30, width: 20, height: 10 },
        total: 2500,
        produced: 1500,
        status: "Diproduksi",
      },
    ],
  },
   {
    id: "PO-003",
    customerId: "CUST-003",
    customerName: "Toko Berkah",
    poNumber: "PO/TB/2024/010",
    orderDate: "2024-05-20T09:00:00Z",
    status: "Open",
    items: [
      {
        id: "ITEM-003-A",
        name: "Kardus Mie Instan",
        materialSize: { length: 70, width: 50 },
        finishedSize: { length: 35, width: 25, height: 15 },
        total: 5000,
        produced: 0,
        status: "Draft",
      },
    ],
  },
];

export const recentPOs = purchaseOrders.slice(0, 5);
