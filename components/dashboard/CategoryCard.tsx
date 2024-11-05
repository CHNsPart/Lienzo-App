"use client"

import { CategoryCardProps } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  const imageUrl = category.product.image 
    ? `data:image/jpeg;base64,${Buffer.from(category.product.image).toString('base64')}`
    : '/placeholder-image.jpg';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-1 ring-black' : 'hover:shadow-md'
        }`}
        onClick={onClick}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative w-12 h-12">
            <Image
              src={imageUrl}
              alt={category.product.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{category.product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {category.count} License{category.count !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}