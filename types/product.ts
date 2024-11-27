export interface Product {
  id: string;
  name: string;
  description: string;
  features: string;  
  image: Buffer | null;
  durations: string; 
  versions: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface Feature {
  name: string;
  description: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  features: Feature[];
  durations: number[];
  versions: string[];
  image?: File;
}