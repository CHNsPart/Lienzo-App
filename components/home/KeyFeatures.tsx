'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

const FeatureTab: React.FC<{
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
}> = ({ feature, isActive, onClick }) => (
  <div
    className={cn(
      "transition-colors duration-200 pb-2 px-2.5 pt-2 cursor-pointer font-bold text-center",
      "whitespace-normal md:whitespace-nowrap",
      "mb-2 md:mb-0 md:mr-4",
      isActive
        ? "text-[#F26B60] border-[#F26B60] md:border-b-4 rounded-sm bg-gradient-to-t from-lienzo/10 via-transparent to-transparent"
        : "text-[#AFAFAF]"
    )}
    onClick={onClick}
  >
    <span className="text-sm md:text-base">{feature.title}</span>
  </div>
);

export default function KeyFeatures() {
  const [activeFeature, setActiveFeature] = useState<string>(features[0].id);
  const activeFeatureData = features.find(feature => feature.id === activeFeature) || features[0];

  return (
    <section className="my-36 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#F26B60]">
        Things We Do
      </h2>
      <h3 className="text-lg md:text-xl text-center mb-8 md:mb-16 text-[#AFAFAF]">
        Why Choose Lienzo?
      </h3>
      
      <div className="max-w-6xl mx-auto">
        {/* Feature Tabs */}
        <div className="flex flex-col md:flex-row mb-8 md:mb-12">
          {features.map((feature) => (
            <FeatureTab
              key={feature.id}
              feature={feature}
              isActive={activeFeature === feature.id}
              onClick={() => setActiveFeature(feature.id)}
            />
          ))}
        </div>

        {/* Feature Content */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:h-96 space-y-6 md:space-y-0">
          {/* Image Section */}
          <div className="w-full md:w-2/3 relative h-48 md:h-auto rounded-xl overflow-hidden border">
            <Image 
              src={activeFeatureData.imageUrl} 
              alt={activeFeatureData.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Description Section */}
          <div className="flex flex-col justify-between w-full md:w-1/3 md:pl-12 space-y-6 md:space-y-0">
            <h3 className="text-2xl md:text-5xl text-center md:text-right text-[#373A42]">
              {activeFeatureData.description}
            </h3>
            <Link href="/dashboard" className="w-full">
              <Button 
                className="bg-[#F26B60] group hover:bg-[#F26B60]/90 text-white w-full" 
                size="lg"
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}