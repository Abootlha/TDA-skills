export interface Course {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  duration: string;
  location: string;
  image: string;
  badge: string;
  badgeColor: string;
  features: string[];
  level?: string;
}
