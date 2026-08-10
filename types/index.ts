export interface Photo {
  id: string;
  title: string;
  image_url: string;
  caption?: string;
  brand_slug: string;
  brand_title?: string;
  is_featured: boolean;
  aspect_ratio?: string;
  display_order?: number;
  created_at?: string;
}

export interface Brand {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover_image: string;
  whatsapp_message?: string;
  display_order?: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  event_type: string;
  quote: string;
  avatar_url?: string;
  rating?: number;
  brand_slug?: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  about_text: string;
  whatsapp_number: string;
  default_whatsapp_message: string;
  address: string;
  email: string;
  instagram_url: string;
  youtube_url: string;
  og_image_url?: string;
  about_image_url?: string;
  camera_image_url?: string;
}

export interface AdminToast {
  message: string;
  type: "success" | "error";
}

export interface PackageItem {
  id: string;
  brand_slug: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  is_popular: boolean;
  popular_label?: string;
  wa_message?: string;
  display_order?: number;
  created_at?: string;
}

