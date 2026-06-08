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

export interface NVQCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tag: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

