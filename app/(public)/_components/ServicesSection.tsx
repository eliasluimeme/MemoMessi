'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';

import { BackgroundBeams } from '@/components/ui/background-beams';

import { FeatureCards } from './FeatureCards';

export function ServicesSection() {
  const servicesRef = useRef(null);
  const { scrollYProgress: servicesScrollProgress } = useScroll({
    target: servicesRef,
    offset: ['start end', 'end start'],
  });

  // Smoother easing function for scroll animations
  const smoothTransform = (progress: number) => {
    return 1 - Math.pow(1 - progress, 3); // Cubic easing
  };

  // Header animations
  const headerOpacity = useTransform(
    servicesScrollProgress,
    [0, 0.15, 0.3, 0.45],
    [0, 0.3, 0.7, 1],
    { ease: smoothTransform },
  );
  const headerY = useTransform(servicesScrollProgress, [0, 0.45], [100, 0], {
    ease: smoothTransform,
  });

  // Title animations
  const titleOpacity = useTransform(
    servicesScrollProgress,
    [0.1, 0.25, 0.4, 0.55],
    [0, 0.3, 0.7, 1],
    { ease: smoothTransform },
  );
  const titleY = useTransform(servicesScrollProgress, [0.1, 0.55], [80, 0], {
    ease: smoothTransform,
  });

  // Description animations
  const descriptionOpacity = useTransform(
    servicesScrollProgress,
    [0.2, 0.35, 0.5, 0.65],
    [0, 0.3, 0.7, 1],
    { ease: smoothTransform },
  );
  const descriptionY = useTransform(servicesScrollProgress, [0.2, 0.65], [60, 0], {
    ease: smoothTransform,
  });

  // Cards animation
  const cardsOpacity = useTransform(
    servicesScrollProgress,
    [0.4, 0.55, 0.7, 0.85],
    [0, 0.3, 0.7, 1],
    { ease: smoothTransform },
  );
  const cardsY = useTransform(servicesScrollProgress, [0.4, 0.85], [60, 0], {
    ease: smoothTransform,
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <BackgroundBeams />
      <div className="container relative mx-auto mb-10 px-4">
        {/* Section Header */}
        <div className="relative" ref={servicesRef}>
          <motion.div
            style={{
              opacity: headerOpacity,
              y: headerY,
            }}
            className="mb-20 text-center"
          >
            <motion.h2
              style={{
                opacity: titleOpacity,
                y: titleY,
              }}
              className="mb-6 mt-32 bg-gradient-to-r from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
            >
              Trusted <span className="gradient-text">Today</span> and{' '}
              <span className="gradient-text">Tomorrow</span>
            </motion.h2>
            <motion.p
              style={{
                opacity: descriptionOpacity,
                y: descriptionY,
              }}
              className="mx-auto max-w-3xl text-lg font-light text-gray-400"
            >
              We empower individuals and businesses to succeed in the dynamic world of
              cryptocurrencies by offering tailored investment advisory, portfolio management,
              market analysis, and blockchain project development. Whether you&apos;re a seasoned
              investor or just starting out, we provide expert strategies, educational resources,
              and hands-on training to help you make informed decisions and seize profitable
              opportunities maximizing value and ensuring long-term returns.
            </motion.p>
            {/* <motion.div
              style={{
                opacity: buttonOpacity,
                y: buttonY,
              }}
              className="mt-8"
            >
              <Button
                size="lg"
                className="group rounded-full bg-blue-500 px-8 py-6 text-white transition-all hover:bg-blue-600"
              >
                More on Capital Markets
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div> */}
          </motion.div>
          <BackgroundBeams />
        </div>

        {/* Services Cards */}
        <motion.div
          style={{
            opacity: cardsOpacity,
            y: cardsY,
          }}
        >
          <FeatureCards />
        </motion.div>
      </div>
    </section>
  );
}
