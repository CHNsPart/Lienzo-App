'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import MultiStepModal from '../modals/MultiStepModal';

interface QuoteContentProps {
  onOpenModal: () => void;
}

const QuoteContent: React.FC<QuoteContentProps> = ({ onOpenModal }) => (
  <div className="w-full md:w-3/6 py-12 md:py-24 px-6 md:px-12 flex flex-col justify-between">
    <h2 className="text-3xl md:text-5xl font-bold mb-4">Get a Quote</h2>
    <p className="mb-8 text-lg md:text-xl text-[#AFAFAF]">
      Quote based on your <br className="hidden md:block" /> business needs.
    </p>
    <Button 
      className="bg-lienzo w-full md:w-1/2" 
      onClick={onOpenModal}
    >
      Get a Quote
    </Button>
  </div>
);

const QuoteImage: React.FC = () => (
  <div className="w-full h-[200px] md:h-auto md:w-4/6 relative rounded-xl">
    <Image 
      src="/images/get-quote.png" 
      alt="Business person working" 
      fill
      className="object-cover md:rounded-r-xl absolute right-0"
      priority
    />
  </div>
);

const GetQuote: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="my-36 px-4 md:px-0">
      <div className="max-w-6xl mx-auto rounded-xl flex flex-col-reverse md:flex-row justify-between items-stretch bg-gradient-to-l from-lienzo/30 via-lienzo/20 to-transparent">
        <QuoteContent onOpenModal={handleOpenModal} />
        <QuoteImage />
      </div>
      <MultiStepModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default GetQuote;