export interface WishlistItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  price: number;
  link?: string;
  is_priority: boolean;
  created_at: string;
}