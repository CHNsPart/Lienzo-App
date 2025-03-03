import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-8 bg-white border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start max-w-6xl mx-auto space-y-8 md:space-y-0">
        {/* Logo and Tagline */}
        <div className='flex items-start gap-2 mb-6 md:mb-0'>
          <Image src="/lienzo-logo.png" alt="Lienzo Logo" width={40} height={50} />
          <div className='flex flex-col items-start'>
            <h1 className='text-3xl md:text-4xl font-bold'>Lienzo</h1>
            <p className="text-sm md:text-md italic text-[#A4ABB5]">we do more</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16 w-full md:w-auto">
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-2 text-[#373A42]">Quick Links</h4>
            <ul className="text-[#A4ABB5] space-y-2">
              <li><Link href="/dashboard" className="hover:text-[#F26B60] transition-colors">Dashboard</Link></li>
              <li><Link href="/store" className="hover:text-[#F26B60] transition-colors">Store</Link></li>
            </ul>
          </div>

          {/* Career */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-2 text-[#373A42]">Career</h4>
            <ul className="text-[#A4ABB5] space-y-2">
              <li><Link href="#" className="hover:text-[#F26B60] transition-colors">Explore</Link></li>
              <li><Link href="#" className="hover:text-[#F26B60] transition-colors">Apply</Link></li>
            </ul>
          </div>

          {/* Ventures */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-2 text-[#373A42]">Ventures</h4>
            <ul className="text-[#A4ABB5] space-y-2">
              <li><Link href="/lienzo" className="hover:text-[#F26B60] transition-colors">Lienzo</Link></li>
              <li><Link href="#" className="hover:text-[#F26B60] transition-colors">Other</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}