export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  priceEstimate: string; // e.g. "Starts at ₹249"
  imageUrl: string;
  threeDType: 'nameplate' | 'keychain' | 'anime' | 'planter' | 'gift' | 'utility';
  tags: string[];
  whatsappMessage: string;
  amazonUrl?: string;
  meeshoUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  readTime: string;
  publishedDate: string;
  tags: string[];
}

export interface CustomQuotaForm {
  name: string;
  phone: string;
  idea: string;
  material: 'PLA' | 'PETG' | 'ABS' | 'Resin';
  color: string;
  quantity: number;
  sizeEstimate: string;
}

export type OrderStatus = 'pending' | 'printing' | 'shipped' | 'delivered' | 'cancelled';

export interface PrintOrder {
  id: string;
  userId: string;
  itemName: string;
  category: string;
  price: number;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  createdAt: string; // ISO String format
  estimatedDelivery: string;
  filamentColor: string;
  material: string;
  layerHeight: string;
  infill: string;
  rating?: number;
  feedback?: string;
}

