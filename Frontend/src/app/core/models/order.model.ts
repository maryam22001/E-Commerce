import { Product } from './product.model';
import { User } from './user.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
