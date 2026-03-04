'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

import { motion } from 'framer-motion';

const images = [
  '/profits/5821167565563170210.jpg',
  '/profits/5823419365376855348.jpg',
  '/profits/5823419365376855662.jpg',
  '/profits/5823419365376855663.jpg',
  '/profits/5823419365376855666.jpg',
  '/profits/5823419365376855667.jpg',
  '/profits/5823419365376855681.jpg',
  '/profits/5825564456728071757.jpg',
  '/profits/5827816256541756500.jpg',
];

export function ClientsProfitSection() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
    },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );
  return (
    <div className="relative overflow-hidden py-24 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-0" />

      <div className="container relative mx-auto px-6 max-w-[1400px]">
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-4xl font-light tracking-tighter text-transparent md:text-6xl"
          >
            Real Results, <span className="text-white font-medium">Real Profits</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base md:text-lg font-light tracking-wide text-zinc-400 leading-relaxed"
          >
            Our clients consistently achieve remarkable returns through our expert signals and
            strategic guidance.
          </motion.p>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-[1400px]">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y" style={{ animationTimingFunction: "linear" }}>
              {/* Combine sets of images to assure endless loop content width */}
              {[...images, ...images, ...images].map((image, index) => (
                <div
                  key={`image-${index}`}
                  className="relative min-w-0 shrink-0 flex-grow-0 basis-auto px-2 sm:px-3 md:px-4"
                >
                  <div className="group relative h-[300px] w-[220px] transform overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] shadow-2xl transition-all duration-300 hover:z-50 hover:-translate-y-4 sm:h-[360px] sm:w-[280px] md:h-[460px] md:w-[320px]">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#09090b]/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                    <Image
                      src={image}
                      alt={`Client profit ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, 320px"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#09090b] to-transparent p-6">
                      <div className="text-sm font-medium tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {index % 2 === 0 ? '+328.5%' : index % 3 === 1 ? '+245.2%' : '+189.7%'}{' '}
                        Return
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side fade effects */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#09090b] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#09090b] to-transparent md:w-40" />
        </div>
      </div>
    </div>
  );
}
