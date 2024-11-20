export interface WishlistItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  price: number;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  avatar_url?: string;
}