'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Support {
  id: string;
  title: {
    main: string;
    sub: string;
  };
  description: string;
  tagline: string;
  imageUrl: string;
}

const supports: Support[] = [
  {
    id: 'office-support',
    title: {
      main: 'Comprehensive',
      sub: 'Office Support'
    },
    tagline: 'Set up your office with ease!',
    description: 'Lienzo provides end-to-end office support services, ensuring your workspace is fully functional and optimized.',
    imageUrl: '/images/support-hero.png'
  },
  {
    id: 'tech-team',
    title: {
      main: 'Professional',
      sub: 'Tech Team'
    },
    tagline: 'Build your dream team effortlessly!',
    description: 'Lienzo provides vetted tech professionals, ensuring your tech team is skilled and efficient.',
    imageUrl: '/images/tech-team.png'
  }
];

export default function HiringSupport() {
  const [activeSupport, setActiveSupport] = useState<string>(supports[0].id);
  const activeSupportData = supports.find(support => support.id === activeSupport) || supports[0];

  return (
    <section className="my-36 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row mb-8 md:mb-12">
            {supports.map((support) => (
              <div
                key={support.id}
                className={cn(
                  "transition-colors duration-200 pb-2 px-2.5 pt-2 cursor-pointer font-bold whitespace-nowrap",
                  "mb-4 md:mb-0 md:mr-4",
                  activeSupport === support.id
                    ? "text-[#F26B60] border-[#F26B60] md:border-b-4 rounded-sm bg-gradient-to-t from-lienzo/10 via-transparent to-transparent"
                    : "text-[#AFAFAF]"
                )}
                onClick={() => setActiveSupport(support.id)}
              >
                {support.title.main} {support.title.sub}
              </div>
            ))}
          </div>
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
          <div className="w-full lg:w-2/5 lg:pr-12 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-[#F26B60]">{activeSupportData.title.main}</span>
                <br />
                <span className="text-[#F26B60]">{activeSupportData.title.sub}</span>
              </h2>
              <p className="text-xl lg:text-2xl font-medium text-gray-800 mt-4">
                {activeSupportData.tagline}
              </p>
              <p className="text-lg lg:text-xl text-gray-500 mt-8 lg:mt-12 leading-relaxed">
                {activeSupportData.description}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <Link href={"/maintenance"}>
                <Button className="bg-[#F26B60] group hover:bg-[#F26B60]/90 text-white self-end w-full" size="lg">
                  Learn More <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-3/5 relative overflow-hidden rounded-xl border min-h-[300px] lg:min-h-0">
            <Image 
              src={activeSupportData.imageUrl} 
              alt={`${activeSupportData.title.main} ${activeSupportData.title.sub}`}
              height={500}
              width={500}
              className='object-cover size-full'
            />
          </div>
        </div>
      </div>
    </section>
  );
}