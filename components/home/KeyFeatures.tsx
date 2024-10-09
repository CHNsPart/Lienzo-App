"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface Feature {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const features: Feature[] = [
  {
    id: 'bulk-license',
    title: 'Bulk License Purchasing',
    description: 'Buy multiple software licenses with ease, saving time and effort.',
    imageUrl: '/images/feature1.png',
  },
  {
    id: 'centralized-management',
    title: 'Centralized License Management',
    description: 'Manage all your software licenses from a single, intuitive dashboard.',
    imageUrl: '/images/feature2.png',
  },
  {
    id: 'user-dashboard',
    title: 'User-Centric Dashboard',
    description: 'Enjoy a personalized dashboard tailored to your specific needs.',
    imageUrl: '/images/feature3.png',
  },
];

export default function KeyFeatures() {
  const [activeFeature, setActiveFeature] = useState<string>(features[0].id);

  const activeFeatureData = features.find(feature => feature.id === activeFeature) || features[0];

  return (
    <section className="my-36 px-8">
      <h2 className="text-4xl font-bold text-center mb-4 text-[#F26B60]">Key Features</h2>
      <h3 className="text-xl text-center mb-16 text-[#AFAFAF]">Why Choose Lienzo?</h3>
      <div className="max-w-6xl mx-auto">
        <div className="flex mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                "mr-4 transition-colors duration-200 pb-2 px-2.5 pt-2 cursor-pointer font-bold",
                activeFeature === feature.id
                  ? "text-[#F26B60] border-[#F26B60] border-b-4 rounded-sm bg-gradient-to-t from-lienzo/10 via-transparent to-transparent"
                  : "text-[#AFAFAF]"
              )}
              onClick={() => setActiveFeature(feature.id)}
            >
              {feature.title}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-stretch h-96">
          <div className="w-2/3 relative overflow-hidden rounded-xl border">
            <Image 
              src={activeFeatureData.imageUrl} 
              alt={activeFeatureData.title}
              fill
              className='object-cover'
            />
          </div>
          <div className="flex flex-col justify-between w-1/3 pl-12">
            <h3 className="text-5xl text-right text-[#373A42]">{activeFeatureData.description}</h3>
            <Link href={"/dashboard"}>
              <Button className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white self-end w-full" size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}