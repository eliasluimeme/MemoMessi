'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => {
  const message = 'Hello, I want the ';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group relative w-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-transparent hover:shadow-[0_0_30px_4px_rgba(59,130,246,0.1)] sm:p-6 md:w-[340px] lg:w-[300px] ${
        isPopular ? 'border-blue-500/20' : ''
      }`}
    >
      {/* Glass Effects */}
      <div className="absolute -inset-[1px] -z-10 rounded-3xl bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />
      <div className="absolute -inset-[2px] -z-10 rounded-3xl bg-gradient-to-t from-blue-500/5 via-transparent to-blue-300/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {isPopular && (
        <div className="absolute -right-12 top-6 rotate-45 bg-blue-500 px-12 py-1 text-xs font-medium text-white sm:top-8 sm:text-sm">
          Popular
        </div>
      )}

      <div className="mb-4 sm:mb-5">
        <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">{title}</h3>
        <p className="text-xs text-gray-400 sm:text-sm">{description}</p>
      </div>

      <div className="mb-4 sm:mb-6">
        <span className="text-2xl font-bold text-white sm:text-4xl">{price}</span>
      </div>

      <ul className="mb-6 space-y-3 text-sm sm:mb-8 sm:space-y-4 sm:text-base">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-300 sm:gap-3">
            <Check className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          window.open(`https://wa.me/+212721220118?text=${message + title + ' plan.'}`, '_blank')
        }
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-blue-300 sm:py-3 sm:text-base"
      >
        Get Started
      </button>
    </motion.div>
  );
};

const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute h-full w-full">
        {/* Animated gradient circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute right-1/4 top-2/3 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[100px]"
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

export function PricingSection() {
  const pricingRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: pricingRef,
    offset: ['start end', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);

  const plans = [
    {
      title: '1 Month',
      price: '499 MAD',
      description: '',
      features: [
        'Advanced market analysis',
        'Trading signals',
        'Daily portfolio review',
        '24/7 dedicated support',
        'Access to educational content',
        'Advanced risk management',
        'Compliance & legal support',
      ],
    },
    {
      title: '3 Months',
      price: '999 MAD',
      description: '',
      features: [
        'Advanced market analysis',
        'Trading signals',
        'Daily portfolio review',
        '24/7 dedicated support',
        'Access to educational content',
        'Advanced risk management',
        'Compliance & legal support',
      ],
      isPopular: true,
    },
    {
      title: '6 Months',
      price: '1599 MAD',
      description: '',
      features: [
        'Advanced market analysis',
        'Trading signals',
        'Daily portfolio review',
        '24/7 dedicated support',
        'Access to educational content',
        'Advanced risk management',
        'Compliance & legal support',
      ],
    },
    {
      title: '1 Year',
      price: '2999 MAD',
      description: '',
      features: [
        'Advanced market analysis',
        'Trading signals',
        'Daily portfolio review',
        '24/7 dedicated support',
        'Access to educational content',
        'Advanced risk management',
        'Compliance & legal support',
      ],
    },
  ];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden py-12 sm:py-20"
      ref={pricingRef}
    >
      <BackgroundBeams />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="mb-10 text-center sm:mb-16"
        >
          <h2 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl lg:text-5xl">
            Choose Your <span className="text-blue-400">Plan</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
            Select the perfect plan for your crypto journey. All plans include our core features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          style={{ opacity: cardsOpacity, y: cardsY }}
          className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8"
        >
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
