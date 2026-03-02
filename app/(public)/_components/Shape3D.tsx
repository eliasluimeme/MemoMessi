'use client';

import { useRef } from 'react';

import Image from 'next/image';

import { motion, useScroll, useTransform } from 'framer-motion';

export function Shape3D() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} style={{ opacity }} className="relative h-[350px] w-[350px]">
      <div className="absolute right-0 top-0 h-full w-full">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[250px] w-[250px]">
              <Image
                src="/logo.png"
                alt="MemoMessi Logo"
                fill
                className="object-contain"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
