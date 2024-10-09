export interface Product {
  id: string;
  name: string;
  description: string;
  features: string;  
  image: Buffer | null;
  durations: string; 
}

export interface ProductCardProps {
  product: Product;
}