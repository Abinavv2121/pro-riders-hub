import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface Enquiry {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  status?: string;
}

export interface DbProduct {
  id?: string;
  name: string;
  brand: string;
  category: string;
  type: 'bike' | 'apparel' | 'accessory';
  price: number;
  original_price?: number;
  description?: string;
  images: string[];
  specifications: Record<string, string>;
  stock_quantity: number;
  stock_status: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  tag?: string;
  size?: string;
  color?: string;
  is_active?: boolean;
  on_sale?: boolean;
  created_at?: string;
}

export interface Sale {
  id?: string;
  title: string;
  description?: string;
  discount_percentage?: number;
  banner_image?: string;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price?: number;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
}

export interface Order {
  id?: string;
  user_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: 'cod' | 'upi';
  order_status?: 'to_be_delivered' | 'delivered';
  created_at?: string;
}

export interface ProductReview {
  id?: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
  admin_reply?: string;
  replied_at?: string;
  created_at?: string;
}

export interface ProductQuery {
  id?: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  query_message: string;
  admin_reply?: string;
  replied_at?: string;
  status?: 'pending' | 'replied';
  created_at?: string;
}

export interface ServiceRequest {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  package_id: string;
  package_name: string;
  service_date: string;
  service_time_slot: string;
  priority_booking: boolean;
  pickup_delivery: boolean;
  total_price: number;
  bike_brand?: string;
  bike_model?: string;
  problem_description: string;
  bike_photos?: string[];
  invoice_url?: string;
  status?: 'received' | 'diagnosing' | 'awaiting-approval' | 'in-service' | 'ready' | 'delivered';
  created_at?: string;
}

export interface CommunityEvent {
  id?: string;
  name: string;
  description: string;
  banner_image: string;
  faqs: string;
  register_details: string;
  rules: string;
  created_at?: string;
}


