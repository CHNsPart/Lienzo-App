// app/page.tsx
import Hero from '@/components/home/Hero';
import KeyFeatures from '@/components/home/KeyFeatures';
import GetQuote from '@/components/home/GetQuote';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/layout/Footer';
import HiringAndSupport from '@/components/home/HiringAndSupport';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className='p-2 md:p-10'>
        <Hero />
      </div>
      <KeyFeatures />
      <HiringAndSupport />
      <GetQuote />
      <CallToAction />
      <Footer />
    </div>
  );
}