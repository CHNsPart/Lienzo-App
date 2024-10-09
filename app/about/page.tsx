import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

async function getLatestProduct(): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    orderBy: { id: 'desc' }, // Assuming newer products have higher IDs
  });
  return product;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 mt-8">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        {product.image && (
          <Image
            src={`data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`}
            alt={product.name}
            width={50}
            height={50}
            className="rounded-full mr-4"
          />
        )}
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
      </div>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <Link href={`/store/${product.id}`}>
        <Button className="w-full bg-[#F26B60] hover:bg-[#F26B60]/90 text-white">
          Explore {product.name}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default async function AboutUsPage() {

  const latestProduct = await getLatestProduct();

  const features = [
    "Centralized license management",
    "Bulk purchasing capabilities",
    "Customizable dashboards",
    "Compliance monitoring",
    "24/7 Support Line",
  ];

  return (
    <section className='bg-white'>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold mb-6 text-gray-400">About Us</h1>
            
            <div className="space-y-12 mb-16">
              <Section title="Our Story">
                <p className="mb-4">
                  {"Lienzo was born out of a simple yet powerful idea to revolutionize how businesses manage their software licenses. In today's digital landscape, where software is the backbone of operations, we recognized the need for a streamlined, efficient approach to license management."}
                </p>
                <p>
                  {"Our journey began with a team of industry experts who understood the complexities and challenges of enterprise-level software licensing. We set out to create a solution that would not only simplify this process but also empower businesses to make informed decisions, reduce costs, and ensure compliance."}
                </p>
              </Section>

              <Section title="Our Mission">
                <p>
                  {"At Lienzo, our mission is to empower organizations to take control of their software ecosystem. We strive to provide a comprehensive, user-friendly platform that transforms the way businesses acquire, manage, and optimize their software licenses. Through innovation and dedication, we aim to be the catalyst for efficiency and cost-effectiveness in the realm of software asset management."}
                </p>
              </Section>

              <Section title="What Sets Us Apart">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4">
                    {features.map((feature, index) => (
                      <Card key={index} className="flex-shrink-0 w-80 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="mr-2 h-5 w-5 text-[#F26B60]" />
                            <h3 className="font-medium text-gray-800">{feature}</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {`Lienzo offers ${feature.toLowerCase()} to enhance your software license management experience.`}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </Section>
            </div>

            <div className="max-w-6xl py-16 mx-auto rounded-xl flex flex-col bg-gradient-to-b from-lienzo/20 via-lienzo/10 to-transparent">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-6 text-gray-800">{"Ready to Simplify Your License Management?"}</h2>
                <Link href="/dashboard">
                  <Button className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white px-6 py-2 rounded-full transition-colors duration-300">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3 mt-8 lg:mt-0 space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-[#F26B60]">Why Choose Lienzo?</h3>
              <ul className="space-y-4">
                {[
                  { icon: "💡", text: "Intuitive platform for effortless license management" },
                  { icon: "💰", text: "Cost-effective solutions tailored to your needs" },
                  { icon: "🛡️", text: "Ensure compliance with ease and confidence" },
                  { icon: "🤝", text: "Dedicated partner in your digital success" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-2xl mr-3" aria-hidden="true">{item.icon}</span>
                    <p className="text-gray-700">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {latestProduct && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-[#F26B60]">Featured Product</h3>
                <p className="text-gray-600 mb-4">{"Discover our latest innovation in software license management"}</p>
                <ProductCard product={latestProduct} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-transparent border-none p-0">
    <div className="py-4">
      <h2 className="text-2xl font-light mb-4 text-[#F26B60]">{title}</h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  </div>
);