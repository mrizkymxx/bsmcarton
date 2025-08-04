export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registered: string; // ISO date string
}

export type OrderItemStatus = 'Draft' | 'Diproduksi' | 'Siap Kirim' | 'Dikirim';

export interface OrderItem {
  id: string;
  layoutImage?: string;
  materialSize: { length: number; width: number };
  finishedSize: { length: number; width: number; height: number };
  total: number;
  produced: number;
  status: OrderItemStatus;
  notes?: string;
  name: string;
}

export interface PurchaseOrder {
  id: string;
  customerId: string;
  customerName: string;
  poNumber: string;
  orderDate: string; // ISO date string
  items: OrderItem[];
  status: 'Open' | 'Completed' | 'Cancelled';
}

export interface Delivery {
  id: string;
  deliveryNoteNumber: string;
  customerId: string;
  customerName: string;
  deliveryDate: string; // ISO date string
  expedition: string;
  vehicleNumber: string;
  driver: string;
  items: { orderItemId: string, name: string, poNumber: string, quantity: number }[];
}
