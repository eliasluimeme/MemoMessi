'use client';

import { motion } from 'framer-motion';

import { Shape3D } from './Shape3D';

export function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32">
      {/* Background grid effect */}
      <div className="absolute inset-0">
        {/* Diagonal lines */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 0%, transparent 49.5%, rgb(51, 65, 85) 49.5%, rgb(51, 65, 85) 50.5%, transparent 50.5%, transparent 100%),
              linear-gradient(-45deg, transparent 0%, transparent 49.5%, rgb(51, 65, 85) 49.5%, rgb(51, 65, 85) 50.5%, transparent 50.5%, transparent 100%)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Dark gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        />
      </div>

      {/* Content container */}
      <div className="container relative mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-20%' }}
          className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-2xl flex-shrink-0 lg:w-5/12"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              className="mb-8 text-4xl font-light tracking-tighter text-white lg:text-5xl md:text-6xl"
            >
              What is <span className="bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent font-medium">MemoMessi ?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4,
              }}
              className="mb-10 text-base md:text-lg font-light tracking-wide text-zinc-400 leading-relaxed"
            >
              Welcome to MemoMessi. I&apos;m Soufian, a seasoned analyst specializing in the 
              memecoin market. My mission is to empower investors with high-conviction signals, 
              real-time security checks, and lightning-fast execution tools. Join us to find the 
              next 100x gem before the crowd, and safely navigate the most profitable corner 
              of the crypto revolution.
            </motion.p>
          </motion.div>

          {/* 3D Shape Container */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative lg:-right-10 lg:pr-16"
          >
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{
                  duration: 1.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
              >
                <Shape3D />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
