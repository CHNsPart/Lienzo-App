'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import MultiStepModal from '../modals/MultiStepModal';

const GetQuote: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="my-36">
      <div className="max-w-6xl mx-auto rounded-xl flex justify-between items-stretch bg-gradient-to-l from-lienzo/30 via-lienzo/20 to-transparent">
        <div className="w-3/6 py-24 flex flex-col justify-between">
          <h2 className="text-5xl font-bold mb-4">Get a Quote</h2>
          <p className="mb-8 text-xl text-[#AFAFAF]">Quote based on your <br /> business needs.</p>
          <Button className="bg-lienzo w-1/2" onClick={handleOpenModal}>
            Get a Quote
          </Button>
        </div>
        <div className="w-4/6 relative rounded-xl">
          <Image 
            src="/images/get-quote.png" 
            alt="Business person working" 
            fill
            className='object-cover rounded-r-xl absolute right-0'
          />
        </div>
      </div>
      <MultiStepModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </section>
  );
};

export default GetQuote;