'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is Lienzo?",
    answer: "Lienzo is a comprehensive enterprise-level software license management system designed to streamline the process of purchasing, managing, and tracking software licenses for businesses of all sizes."
  },
  {
    question: "How does Lienzo help with license management?",
    answer: "Lienzo provides a centralized platform for tracking all your software licenses, automating renewal reminders, and offering insights into license usage and compliance across your organization."
  },
  {
    question: "Can Lienzo handle bulk license purchases?",
    answer: "Yes, Lienzo is designed to handle bulk license purchases efficiently. Our system allows you to procure multiple licenses at once, saving time and potentially reducing costs through volume discounts."
  },
  {
    question: "Is Lienzo suitable for small businesses?",
    answer: "Absolutely! While Lienzo is robust enough for large enterprises, it's also designed to be user-friendly and scalable for small to medium-sized businesses looking to optimize their software license management."
  },
  {
    question: "How secure is my license data with Lienzo?",
    answer: "Security is our top priority. Lienzo employs industry-standard encryption and security protocols to ensure your license data and sensitive information are always protected."
  },
  {
    question: "Can Lienzo integrate with other software systems?",
    answer: "Yes, Lienzo is designed with integration capabilities in mind. We offer APIs and can work with various popular business software systems to ensure seamless data flow across your organization."
  },
  {
    question: "What kind of support does Lienzo offer?",
    answer: "We provide comprehensive support including 24/7 customer service, detailed documentation, video tutorials, and personalized onboarding to ensure you get the most out of Lienzo."
  }
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{question}</CardTitle>
          <Button variant="ghost" size="sm">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <p className="text-gray-600">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
};

const FAQPage = () => {
  return (
    <div className="bg-white h-full mx-auto p-6 w-full">
      <div className='max-w-4xl mx-auto'>
        <h1 className="text-4xl font-bold mb-6 text-gray-400">Frequently Asked Questions</h1>
        <div className="mb-8">
          <p className="text-xl text-gray-600">Find answers to common questions about Lienzo and how it can transform your software license management.</p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="max-w-6xl py-16 mx-auto rounded-xl flex flex-col bg-gradient-to-b from-lienzo/20 via-lienzo/10 to-transparent">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Still have questions?</h2>
              <p className="mb-6 text-gray-600">Our team is here to help. Don't hesitate to reach out for more information.</p>
              <Button className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white px-6 py-2 rounded-full transition-colors duration-300">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;