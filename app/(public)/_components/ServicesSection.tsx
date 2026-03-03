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
    <section className="relative w-full overflow-hidden py-24 md:py-32">
      <BackgroundBeams />
      <div className="container relative mx-auto px-6 max-w-6xl">
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
              className="mb-6 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-4xl font-light tracking-tighter text-transparent md:text-6xl"
            >
              Catch the <span className="text-white font-medium">Pump</span> Before the{' '}
              <span className="text-white font-medium">Dump</span>
            </motion.h2>
            <motion.p
              style={{
                opacity: descriptionOpacity,
                y: descriptionY,
              }}
              className="mx-auto max-w-3xl text-base md:text-lg font-light tracking-wide text-zinc-400 leading-relaxed"
            >
              We empower degens with institutional-grade tools to master the memecoin markets.
              From 1-click swaps to automated contract security checks, we provide the alpha
              you need to find 100x gems safely and efficiently.
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
