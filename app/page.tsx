// app/page.tsx
import Hero from '@/components/home/Hero';
import KeyFeatures from '@/components/home/KeyFeatures';
import GetQuote from '@/components/home/GetQuote';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className='p-10'>
        <Hero />
      </div>
      <KeyFeatures />
      <GetQuote />
      <CallToAction />
      <Footer />
    </div>
  );
}