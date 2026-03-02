'use client';

import { MotionValue, motion, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Star } from './Star';

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
}

export function HeroSection({ scrollYProgress }: HeroSectionProps) {
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <motion.section className="relative min-h-screen" style={{ y, opacity, scale }}>
      {/* Stars background */}
      <div className="absolute inset-0">
        {/* First layer - closer stars */}
        <Star size="large" className="left-[15%] top-[15%] animate-twinkle" />
        <Star
          size="large"
          className="left-[25%] top-[40%] animate-twinkle [animation-delay:0.5s]"
        />
        <Star size="large" className="left-[60%] top-[25%] animate-twinkle [animation-delay:1s]" />
        <Star
          size="large"
          className="left-[80%] top-[15%] animate-twinkle [animation-delay:1.5s]"
        />
        <Star size="large" className="left-[85%] top-[45%] animate-twinkle [animation-delay:2s]" />
        <Star
          size="large"
          className="left-[45%] top-[30%] animate-twinkle [animation-delay:2.5s]"
        />

        {/* Second layer - medium distance */}
        <Star
          size="medium"
          className="left-[10%] top-[35%] animate-twinkle [animation-delay:0.7s]"
        />
        <Star
          size="medium"
          className="left-[20%] top-[20%] animate-twinkle [animation-delay:1.2s]"
        />
        <Star
          size="medium"
          className="left-[40%] top-[15%] animate-twinkle [animation-delay:1.7s]"
        />
        <Star
          size="medium"
          className="left-[65%] top-[35%] animate-twinkle [animation-delay:2.2s]"
        />
        <Star
          size="medium"
          className="left-[75%] top-[25%] animate-twinkle [animation-delay:2.7s]"
        />
        <Star
          size="medium"
          className="left-[50%] top-[40%] animate-twinkle [animation-delay:3.2s]"
        />

        {/* Third layer - distant stars */}
        <Star className="left-[5%] top-[45%] animate-twinkle [animation-delay:0.2s]" />
        <Star className="left-[30%] top-[25%] animate-twinkle [animation-delay:0.9s]" />
        <Star className="left-[45%] top-[40%] animate-twinkle [animation-delay:1.4s]" />
        <Star className="left-[70%] top-[20%] animate-twinkle [animation-delay:1.9s]" />
        <Star className="left-[90%] top-[35%] animate-twinkle [animation-delay:2.4s]" />
        <Star className="left-[55%] top-[15%] animate-twinkle [animation-delay:2.9s]" />

        {/* Additional scattered stars */}
        <Star className="left-[12%] top-[55%] animate-twinkle [animation-delay:3s]" />
        <Star className="left-[35%] top-[60%] animate-twinkle [animation-delay:3.5s]" />
        <Star className="left-[55%] top-[50%] animate-twinkle [animation-delay:4s]" />
        <Star className="left-[78%] top-[58%] animate-twinkle [animation-delay:4.5s]" />
        <Star className="left-[92%] top-[52%] animate-twinkle [animation-delay:5s]" />
        <Star className="left-[22%] top-[48%] animate-twinkle [animation-delay:5.5s]" />
      </div>

      {/* Center glow effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -left-[175px] -top-[175px] h-[350px] w-[350px] animate-glow-pulse bg-blue-500/20 blur-[70px]" />
          <div className="absolute -left-[150px] -top-[150px] h-[300px] w-[300px] animate-glow-pulse bg-blue-400/20 blur-[60px] [animation-delay:1s]" />
          <div className="absolute -left-[125px] -top-[125px] h-[250px] w-[250px] animate-glow-pulse bg-blue-300/20 blur-[50px] [animation-delay:2s]" />
        </div>
      </div>

      {/* Content */}
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        {/* Main heading */}
        <motion.h1
          style={{
            scale: useTransform(scrollYProgress, [0, 1], [1, 0.9]),
            opacity: useTransform(scrollYProgress, [0, 0.7], [1, 0]),
          }}
          className="mb-6 max-w-4xl text-5xl font-light leading-tight text-white md:text-6xl lg:text-7xl"
        >
          <motion.span
            style={{
              x: useTransform(scrollYProgress, [0, 1], [0, -30]),
              opacity: useTransform(scrollYProgress, [0, 0.6], [1, 0]),
            }}
            className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
          >
            MemoMessi
          </motion.span>
          <motion.br />
          <motion.span
            style={{
              x: useTransform(scrollYProgress, [0, 1], [0, 30]),
              opacity: useTransform(scrollYProgress, [0, 0.6], [1, 0]),
            }}
          >
            investing in crypto
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 30]),
            opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]),
          }}
          className="mb-12 max-w-2xl text-lg font-light text-gray-400"
        >
          We provide a secure, feature-rich platform that simplifies the investment process and
          opens the door to new possibilities in the crypto market.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 50]),
            opacity: useTransform(scrollYProgress, [0, 0.4], [1, 0]),
          }}
          className="flex flex-col gap-4 sm:flex-row sm:gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Button
              size="lg"
              className="group relative overflow-hidden rounded-full bg-blue-600 px-8 py-6 text-white transition-all duration-500 hover:shadow-glow"
              onClick={() => (window.location.href = '/login')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {/* <BackgroundBeams /> */}
    </motion.section>
  );
}
