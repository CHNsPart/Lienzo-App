"use client"

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Server, Code, Palette, Network, Shield, Cloud, Database } from 'lucide-react';
import { useState } from 'react';
import HireTeamModal from '@/components/modals/HireTeamModal';

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center border-b">
        <Image
          src="/images/tech-team.png"
          alt="Tech Team and Office Support"
          fill
          className="object-cover brightness-[0.3]"
          quality={100}
          priority
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            End-to-End <span className='text-lienzo'>Business Support</span> Solutions
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl leading-relaxed">
            From office infrastructure to skilled tech teams, we provide comprehensive solutions to power your business growth.
          </p>
        </div>
      </section>

      {/* Office Support Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-20">
            Office <span className='text-lienzo'>Support</span> Services
          </h2>
          <div className="grid md:grid-cols-2 items-center gap-16">
            <div className="space-y-8">
              <h3 className="text-3xl font-semibold text-zinc-400">Infrastructure Management</h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-4 group">
                  <Server className="h-6 w-6 text-[#F26B60] mt-3 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className='group-hover:bg-lienzo/5 p-2 rounded-lg'>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">Network Setup & Maintenance</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Complete network infrastructure setup, security implementation, and 24/7 monitoring services with proactive maintenance and support.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <Shield className="h-6 w-6 text-[#F26B60] mt-3 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className='group-hover:bg-lienzo/5 p-2 rounded-lg'>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">Security Systems</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Advanced security solutions including firewall setup, threat detection, and regular security audits to protect your business assets.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <Cloud className="h-6 w-6 text-[#F26B60] mt-3 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className='group-hover:bg-lienzo/5 p-2 rounded-lg'>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">Cloud Infrastructure</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Seamless cloud integration and management, including hybrid cloud solutions and cloud-native application support.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <Database className="h-6 w-6 text-[#F26B60] mt-3 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className='group-hover:bg-lienzo/5 p-2 rounded-lg'>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">Data Management</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Comprehensive data backup solutions, disaster recovery planning, and database management services.
                    </p>
                  </div>
                </li>
                {/* Add more infrastructure items here */}
              </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/infrastructure.png"
                alt="Office Infrastructure"
                fill
                quality={100}
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Team Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-20">
            Professional <span className='text-lienzo'>Tech</span> Teams
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamCard 
              icon={<Code />}
              title="Software Engineers"
              description="Full-stack developers, mobile app specialists, and DevOps engineers with proven expertise."
            />
            <TeamCard 
              icon={<Palette />}
              title="Design Team"
              description="UI/UX designers, graphic artists, and creative directors to bring your vision to life."
            />
            <TeamCard 
              icon={<Network />}
              title="Network Specialists"
              description="System administrators and network engineers to maintain your infrastructure."
            />
          </div>
        </div>
        <span className='w-full flex justify-center items-center pt-12 text-lienzo text-center'>and more...</span>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-6xl py-16 mx-auto rounded-xl flex flex-col bg-gradient-to-b from-lienzo/20 via-lienzo/10 to-transparent">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
              Ready to Build Your <span className='text-lienzo'>Dream</span> Team?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto px-4">
              Get in touch with us to discuss your requirements and let us help you assemble the perfect team for your business needs.
            </p>
            <Button 
              size="lg" 
              className="bg-[#F26B60] group hover:bg-[#F26B60]/90 rounded-full text-white px-8"
              onClick={() => setIsModalOpen(true)}
            >
              Get a Quote
              <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-4" />
            </Button>
          </div>
        </div>
        <HireTeamModal 
          isOpen={isModalOpen} 
          onClose={setIsModalOpen} 
        />
      </section>
    </main>
  );
}

function TeamCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 border rounded-xl hover:shadow-xl transition-all duration-300 group bg-white hover:-translate-y-1">
      <div className="w-14 h-14 bg-[#F26B60]/10 rounded-xl flex items-center justify-center text-[#F26B60] mb-6 group-hover:bg-[#F26B60] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}