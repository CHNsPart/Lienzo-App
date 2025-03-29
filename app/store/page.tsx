// app/store/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAdmin } from "@/lib/auth";
import { PhoneCall } from 'lucide-react';
import ProductCard from "@/components/store/ProductCard";

async function getProducts() {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array instead of throwing error
  }
}

export default async function StorePage() {
  const { getUser } = getKindeServerSession();
  const user: any = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const products = await getProducts();
  const admin = await isAdmin(user);

  return (
    <div className="p-6">
      <div className="flex justify-between items-stretch mb-6 border p-5 bg-gradient-to-r from-gray-200 to-transparent">
        <div>
          <h1 className="text-3xl font-bold">Effortless License <br /> Canvas</h1>
          <p className="text-gray-600">Buy, Manage, and Streamline <br /> License Solutions</p>
        </div>
        <div className="flex flex-col justify-between">
          <Button variant="outline" className="h-12 flex gap-2"><PhoneCall className="size-4 text-purple-600" /> Contact Support</Button>
          <p className="text-sm text-gray-500 mt-2">Or email support@mail.com</p>
        </div>
      </div>

      <div className="flex justify-between items-start w-full h-fit mb-6">
        <Input 
          type="text" 
          placeholder="Search License" 
          className="max-w-md"
        />
        {admin && (
          <Link href="/store/create">
            <Button>Create New Product</Button>
          </Link>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Business Choice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                image: product.image ? Buffer.from(product.image) : null
              }}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products available yet.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Market Fresh</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {products && products.length > 0 ? (
          products.slice(0, 3).map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                image: product.image ? Buffer.from(product.image) : null
              }}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products available yet.</p>
        )}
      </div>
    </div>
  );
}