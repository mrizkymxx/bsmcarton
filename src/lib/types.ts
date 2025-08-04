
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registered: string; // ISO date string
}

export type OrderItemStatus = 'Draft' | 'Diproduksi' | 'Siap Kirim' | 'Dikirim';
export type OrderItemType = 'Box' | 'Layer';

export interface OrderItem {
  id: string;
  type: OrderItemType;
  name: string;
  layoutImage?: string;
  materialSize: { length: number; width: number };
  finishedSize: { length: number; width: number; height: number };
  total: number;
  produced: number;
  status: OrderItemStatus;
  notes?: string;
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

export interface ProductionItem extends OrderItem {
    poId: string;
    poNumber: string;
    customerName: string;
    orderDate: string;
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
