// components/layout/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 px-8 bg-white border-t border-gray-200">
      <div className="flex justify-between items-start max-w-6xl mx-auto">
        <div className='flex items-start gap-2'>
          <Image src="/lienzo-logo.png" alt="Lienzo Logo" width={40} height={50} />
          <div className='flex flex-col items-start'>
            <h1 className='text-4xl font-bold'>Lienzo</h1>
            <p className="text-md italic text-[#A4ABB5]">we do more</p>
          </div>
        </div>
        <div className="flex space-x-16">
          <div>
            <h4 className="font-bold mb-2 text-[#373A42]">Quick Links</h4>
            <ul className="text-[#A4ABB5]">
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/store">Store</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-[#373A42]">Career</h4>
            <ul className="text-[#A4ABB5]">
              <li><Link href="/explore">Explore</Link></li>
              <li><Link href="/apply">Apply</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-[#373A42]">Ventures</h4>
            <ul className="text-[#A4ABB5]">
              <li><Link href="/lienzo">Lienzo</Link></li>
              <li><Link href="/other">Other</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}