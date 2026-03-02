'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const BackgroundGradient = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute h-full w-full">
        {/* Animated gradient circle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-[120px]"
        />
      </div>
      {/* Grid overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />
    </div>
  );
};

export function ContactSection() {
  const contactRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: contactRef,
    offset: ['start end', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);

  const message = "Hello, I'm interested in your crypto services. Can you help me?";

  return (
    <section
      id="contact-us"
      className="relative min-h-[80vh] w-full overflow-hidden py-12 sm:min-h-screen sm:py-20"
      ref={contactRef}
    >
      <BackgroundGradient />

      <div className="container relative mx-auto px-4">
        <div className="flex min-h-[60vh] flex-col items-center justify-center sm:min-h-[80vh]">
          {/* Section Header */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="mb-8 text-center sm:mb-12"
          >
            <h2 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl lg:text-5xl">
              Let&apos;s <span className="text-blue-400">Connect</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
              Ready to start your crypto journey? We&apos;re here to help you succeed.
            </p>
          </motion.div>

          {/* Contact Content */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="flex w-full max-w-3xl flex-col items-center gap-6 px-4 text-center sm:gap-8 sm:px-6"
          >
            <p className="text-base font-light leading-relaxed text-gray-300 sm:text-xl">
              Whether you&apos;re just starting out or looking to optimize your crypto portfolio,
              our team is ready to provide personalized guidance and support. Let&apos;s discuss how
              we can help you achieve your investment goals.
            </p>

            <div className="group relative mt-4 w-full overflow-hidden rounded-2xl p-[1px] sm:mt-8 sm:w-auto">
              {/* Gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

              <button
                onClick={() => window.open(`https://wa.me/+212721220118?text=${message}`, '_blank')}
                className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-black/80 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact via WhatsApp
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400 sm:mt-6 sm:text-sm">
              Available 24/7 - We typically respond within an hour
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
