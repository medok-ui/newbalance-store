export interface IOrderProduct {
  name: string;
  images: string[];
  price: number;
}

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  size: number;
  quantity: number;
  price: number;
  products: IOrderProduct;
}

export interface IOrder {
  id: number;
  user_id: string;
  status: 'pending' | 'paid' | 'cancelled' | 'shipped' | 'delivered';
  total: number;
  created_at: string;
  stripe_session_id: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    city: string;
  };
  order_items: IOrderItem[];
}
