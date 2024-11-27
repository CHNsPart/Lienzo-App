import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import GetLicenseModal from "@/components/modals/GetLicenseModal";
import ProductCard from "@/components/store/ProductCard";
import { Product } from "@/types/product";
import { isAdmin } from "@/lib/auth";
import dynamic from "next/dynamic";
import { PhoneCall, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteProductModal from "@/components/modals/DeleteProductModal";

const EditProductModal = dynamic(() => import('@/components/modals/EditProductModal'), { ssr: false });

async function getProduct(id: string): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: { id },
  });
}

async function getRecommendedProducts(): Promise<Product[]> {
  return await prisma.product.findMany({
    take: 3,
  });
}

export default async function StoreProductPage({ params }: { params: { productId: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const product = await getProduct(params.productId);
  const recommendedProducts = await getRecommendedProducts();
  const admin = await isAdmin(user);

  if (!product) {
    return <div>Product not found</div>;
  }

  const features = JSON.parse(product.features);
  const durations = JSON.parse(product.durations);
  const versions = JSON.parse(product.versions);

  const imageSource = product.image
    ? `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`
    : '/placeholder-image.jpg';

  return (
    <div className="p-6">
      <div className="border p-5 mb-6 bg-gradient-to-r from-gray-200 to-transparent">
        {/* First row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center h-16">
            <Image
              src={imageSource}
              alt={product.name}
              width={64}
              height={64}
              className="mr-4"
            />
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          {admin ? (
            <div className="flex items-center gap-2">
              <EditProductModal product={product} />
              <DeleteProductModal 
                productId={product.id}
                productName={product.name}
              />
            </div>
          ) : (
            <GetLicenseModal productId={product.id} />
          )}
        </div>

        {/* Second row */}
        <div className="flex justify-between items-baseline relative">
          <p className="text-gray-600 max-w-xs bottom-0 pt-5">{product.description}</p>
          <div className="flex flex-col items-end">
            <Link href={"tel:+6476794211"}>
              <Button variant="outline" className="flex items-center justify-center gap-2 mb-2">
                <PhoneCall className="size-4 text-lienzo" />  Contact Support
              </Button>
            </Link>
            <p className="inline-block align-baseline text-sm text-gray-500">Or email lienzohoc@gmail.com</p>
          </div>
        </div>
      </div>
      <Button variant="outline" className="mb-6">
        <Link href="/store">← Back to Store</Link>
      </Button>

      <h2 className="text-2xl font-semibold mb-4">License Durations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
        {durations.map((duration: number) => (
          <Card key={duration} className="flex items-center justify-center p-6 gap-1">
            <Image
              src={imageSource}
              alt={product.name}
              width={32}
              height={32}
            />
            <h3 className="text-4xl font-semibold">{duration}<span className="font-light text-xl pl-1">months</span></h3>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Available Versions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
        {versions.map((version: string) => (
          <Card key={version} className="flex items-center justify-center p-6">
            <div className="flex items-center gap-2">
              <Tag className="size-5" />
              <Badge variant="outline" className="text-base">
                v{version}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
        {features.map((feature: { name: string, description: string }, index: number) => (
          <Card key={index} className="p-6">
            <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recommended</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}