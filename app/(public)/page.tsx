'use client';

import { useEffect, useRef } from 'react';

import { useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';

import { BackgroundBeams } from '@/components/ui/background-beams';

import { AboutSection } from './_components/AboutSection';
import { ClientsProfitSection } from './_components/ClientsProfitSection';
import { ContactSection } from './_components/ContactSection';
import { HeroSection } from './_components/HeroSection';
import { PricingSection } from './_components/PricingSection';
import { ServicesSection } from './_components/ServicesSection';
import { TestimonialsSection } from './_components/TestimonialsSection';

export default function Home() {
  const targetRef = useRef(null);
  const { setTheme } = useTheme();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black/60">
      <main className="flex-grow" ref={targetRef}>
        <BackgroundBeams />
        <HeroSection scrollYProgress={scrollYProgress} />
        <section id="about-us">
          <AboutSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="results">
          <ClientsProfitSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="contact-us">
          <ContactSection />
        </section>
      </main>
    </div>
  );
}
