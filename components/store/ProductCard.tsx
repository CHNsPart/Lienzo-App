import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { ProductCardProps } from "@/types/product";

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image 
    ? `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`
    : '/placeholder-image.jpg';

  return (
    <Link href={`/store/${product.id}`}>
      <Card className="flex flex-col h-full">
        <CardContent className="flex flex-col justify-between p-6 h-full">
          <div>
            <div className="flex items-center mb-4">
              <Image
                src={imageUrl}
                alt={product.name}
                width={40}
                height={40}
              />
              <h3 className="text-xl font-semibold ml-3">{product.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}