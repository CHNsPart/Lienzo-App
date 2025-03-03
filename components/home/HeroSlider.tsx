'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import Link from 'next/link';
import { SlideContent, SlideProps } from '@/types/hero';

const slides: SlideContent[] = [
  {
    imageSrc: "/images/hero1.png",
    title: "DO MORE",
    subtitle: "Simplified Software License Management for Your Business",
    description: "Streamline how you buy, manage, and track software licenses all in one place.",
  },
  {
    imageSrc: "/images/hero2.png",
    title: "SAVE TIME",
    subtitle: "Efficient License Management at Your Fingertips",
    description: "Automate your license tracking and never miss a renewal deadline again.",
  },
  {
    imageSrc: "/images/hero3.png",
    title: "GROW FASTER",
    subtitle: "Scale Your Software Infrastructure with Ease",
    description: "Flexible licensing solutions that grow with your business needs.",
  },
];

const Slide: React.FC<SlideProps> = ({ slide, isActive, alignment }) => (
  <div
    className={`absolute inset-0 transition-opacity duration-1000 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <Image 
      src={slide.imageSrc}
      alt={`Hero background`}
      fill
      className="opacity-50 rounded-xl object-cover"
      priority={isActive}
    />
    <div className={`absolute inset-0 flex flex-col justify-center p-4 md:p-12 max-w-6xl mx-auto ${
      alignment === 'start' ? 'items-start text-left' : 'items-end text-right'
    }`}>
      <h1 className="text-4xl md:text-7xl font-bold mb-2 md:mb-4 transition-transform duration-500 transform translate-y-0 opacity-100">
        {slide.title}
      </h1>
      <h2 className="text-2xl md:text-3xl mb-2 md:mb-4 transition-transform duration-500 delay-100 transform translate-y-0 opacity-100 max-w-[300px] md:max-w-none">
        {slide.subtitle}
      </h2>
      <p className="mb-4 md:mb-6 text-sm md:text-lg transition-transform duration-500 delay-200 transform translate-y-0 opacity-100 max-w-[250px] md:max-w-none">
        {slide.description}
      </p>
      <Link href="/store">
        <Button 
          className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white transition-transform duration-500 delay-300 transform translate-y-0 opacity-100" 
          size="lg"
        >
          Discover Products
        </Button>
      </Link>
    </div>
  </div>
);

const NavigationButton: React.FC<{
  direction: 'left' | 'right';
  onClick: () => void;
}> = ({ direction, onClick }) => (
  <button 
    className={`absolute ${direction === 'left' ? 'left-2 md:left-4' : 'right-2 md:right-4'} 
      top-1/2 transform -translate-y-1/2 
      bg-black bg-opacity-50 text-white p-2 rounded-full
      hidden md:block`}
    onClick={onClick}
  >
    {direction === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
  </button>
);

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
        <Slide
          key={index}
          slide={slide}
          isActive={index === currentSlide}
          alignment={index === 1 ? 'start' : 'end'}
        />
      ))}
      
      <NavigationButton direction="left" onClick={prevSlide} />
      <NavigationButton direction="right" onClick={nextSlide} />

      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#F26B60] scale-125' : 'bg-white opacity-50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}