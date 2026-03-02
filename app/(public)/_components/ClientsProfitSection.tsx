'use client';

import Image from 'next/image';

import { motion } from 'framer-motion';


const images = [
  '/profits/profit1.jpeg',
  '/profits/profit2.jpeg',
  '/profits/profit3.jpeg',
  '/profits/profit4.jpeg',
  '/profits/profit5.jpeg',
  '/profits/profit6.jpeg',
  '/profits/profit7.jpeg',
  '/profits/profit8.jpeg',
  '/profits/profit9.jpeg',
  '/profits/profit10.jpeg',
];

export function ClientsProfitSection() {
  return (
    <div className="relative overflow-hidden py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0" />

      <div className="container relative mx-auto px-4">
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
          >
            Real Results, <span className="gradient-text">Real Profits</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-400"
          >
            Our clients consistently achieve remarkable returns through our expert signals and
            strategic guidance.
          </motion.p>
        </div>

        {/* Single Row Carousel */}
        <div className="relative mx-auto max-w-[1400px]">
          <div className="relative h-[300px] overflow-hidden sm:h-[360px] md:h-[460px]">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex gap-2 overflow-hidden py-3 sm:gap-4"
            >
              {/* First set of images */}
              <div className="animate-scroll-right flex gap-2 sm:gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={`image-${index}`}
                    initial={{ y: 0 }}
                    whileHover={{ y: -20, scale: 1.05, zIndex: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative h-[300px] w-[220px] flex-shrink-0 transform overflow-hidden rounded-xl bg-black/20 transition-all duration-300 sm:h-[360px] sm:w-[280px] md:h-[460px] md:w-[320px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Image
                      src={image}
                      alt={`Client profit ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="320px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {index % 2 === 0 ? '+328.5%' : index % 3 === 1 ? '+245.2%' : '+189.7%'}{' '}
                        Profit
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="animate-scroll-right flex gap-2 sm:gap-4" aria-hidden="true">
                {images.map((image, index) => (
                  <motion.div
                    key={`image-duplicate-${index}`}
                    initial={{ y: 0 }}
                    whileHover={{ y: -20, scale: 1.05, zIndex: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative h-[300px] w-[220px] flex-shrink-0 transform overflow-hidden rounded-xl bg-black/20 transition-all duration-300 sm:h-[360px] sm:w-[280px] md:h-[460px] md:w-[320px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Image
                      src={image}
                      alt={`Client profit ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="320px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {index % 2 === 0 ? '+328.5%' : index % 3 === 1 ? '+245.2%' : '+189.7%'}{' '}
                        Profit
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Side fade effects */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
