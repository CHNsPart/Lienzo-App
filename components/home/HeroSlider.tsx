'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import Link from 'next/link';

interface SlideContent {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: SlideContent[] = [
  {
    imageSrc: "/images/hero1.png",
    title: "DO MORE.",
    subtitle: "Simplified Software License Management for Your Business",
    description: "Streamline how you buy, manage, and track software licenses all in one place.",
  },
  {
    imageSrc: "/images/hero2.png",
    title: "SAVE TIME.",
    subtitle: "Efficient License Management at Your Fingertips",
    description: "Automate your license tracking and never miss a renewal deadline again.",
  },
  {
    imageSrc: "/images/hero3.png",
    title: "GROW FASTER.",
    subtitle: "Scale Your Software Infrastructure with Ease",
    description: "Flexible licensing solutions that grow with your business needs.",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <section 
      className="relative h-[400px] bg-black text-white rounded-xl overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      {...handlers}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image 
            src={slide.imageSrc}
            alt={`Hero background ${index + 1}`}
            fill
            className="opacity-50 rounded-xl object-cover"
            priority={index === 0}
          />
          <div className={`absolute inset-0 flex flex-col justify-center p-12 max-w-6xl mx-auto ${
            index === 1 ? 'items-start' : 'items-end'
          }`}>
            <h1 className="text-7xl font-bold mb-4 transition-transform duration-500 transform translate-y-0 opacity-100">{slide.title}</h1>
            <h2 className="text-3xl mb-4 transition-transform duration-500 delay-100 transform translate-y-0 opacity-100">{slide.subtitle}</h2>
            <p className="mb-6 text-lg transition-transform duration-500 delay-200 transform translate-y-0 opacity-100">{slide.description}</p>
            <Link href={"/store"}>
              <Button className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white transition-transform duration-500 delay-300 transform translate-y-0 opacity-100" size="lg">
                Discover Products
              </Button>
            </Link>
          </div>
        </div>
      ))}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#F26B60] scale-125' : 'bg-white opacity-50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}