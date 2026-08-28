// =============================================
// Database types mirroring Supabase schema
// =============================================

export interface SiteSetting {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url?: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  image_url: string;
  images: string[];
  is_bestseller: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  weight: string;
  sort_order: number;
  created_at: string;
  // Joined
  category?: Category;
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  location: string;
  content: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  notes: string;
  created_at: string;
}

// Settings map for type-safe access
export interface SiteSettings {
  site_name: string;
  tagline: string;
  whatsapp_number: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  announcement_text: string;
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  currency_symbol: string;
  [key: string]: string;
}
