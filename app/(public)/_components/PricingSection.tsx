'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Crown, Lock, MessageCircle } from 'lucide-react';

const PricingCard = ({
  title,
  price,
  priceNote,
  description,
  features,
  lockedFeatures,
  isPopular,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  lockedFeatures?: string[];
  isPopular?: boolean;
  ctaLabel: string;
  ctaHref: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col w-full h-full overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 p-6 ${
        isPopular
          ? 'border-amber-400/30 bg-amber-400/[0.03] shadow-[0_0_50px_rgba(251,191,36,0.1)] hover:shadow-[0_0_60px_rgba(251,191,36,0.15)]'
          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/10'
      }`}
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.02] via-transparent to-black/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Popular ribbon */}
      {isPopular && (
        <div className="absolute -right-9 top-5 rotate-45 bg-amber-400/15 border-y border-amber-400/25 backdrop-blur-md px-10 py-0.5 text-[9px] font-bold text-amber-300 tracking-[0.15em] uppercase">
          Best Value
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        {isPopular ? (
          <div className="flex items-center gap-1.5 mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <h3 className="text-base font-semibold text-amber-300 leading-tight">{title}</h3>
          </div>
        ) : (
          <h3 className="mb-2 text-base font-semibold text-white leading-tight">{title}</h3>
        )}
        <p className="text-[11px] text-zinc-500 font-light tracking-wide leading-relaxed">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-6 pb-5 border-b border-white/[0.05]">
        <span className={`text-3xl font-light tracking-tight ${isPopular ? 'text-amber-100' : 'text-white'}`}>
          {price}
        </span>
        {priceNote && (
          <span className="ml-1.5 text-[11px] text-zinc-600 font-light">{priceNote}</span>
        )}
      </div>

      {/* Features — flex-1 pushes CTA to bottom */}
      <ul className="flex-1 space-y-2.5 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5 text-[12px] text-zinc-300 font-light leading-snug">
            <Check className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-amber-400' : 'text-zinc-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
        {lockedFeatures?.map((feature, index) => (
          <li key={`locked-${index}`} className="flex items-start gap-2.5 text-[12px] text-zinc-700 font-light leading-snug line-through">
            <Lock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-zinc-800" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA — pinned to bottom */}
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full rounded-full px-4 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 ${
          isPopular
            ? 'bg-amber-400/20 border border-amber-400/35 hover:bg-amber-400/30 hover:border-amber-400/50 text-amber-200'
            : 'bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/15 text-zinc-300'
        }`}
      >
        <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
        {ctaLabel}
      </a>
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

  const telegramUrl = 'https://t.me/memomessi';
  const waBase = 'https://wa.me/+212721220118?text=';

  const plans = [
    {
      title: 'Free',
      price: '0 MAD',
      description: 'Get started — no credit card needed',
      features: [
        'Access to all Free signals',
        'Signal status & target updates',
        'Basic market access',
        'Community Telegram group',
      ],
      lockedFeatures: [
        'VIP exclusive signals',
        'Priority Telegram alerts',
        'Unlimited alpha access',
      ],
      ctaLabel: 'Sign Up Free',
      ctaHref: '/signup',
    },
    {
      title: '1 Month VIP',
      price: '499 MAD',
      priceNote: '/ month',
      description: 'The Degen Entry — full signal access',
      features: [
        'All Free signals included',
        'VIP exclusive signals 👑',
        'Real-time Telegram alerts',
        'Entry, Stop-Loss & Targets',
        'Contract address access',
        'Advanced risk analytics',
        'Priority support',
      ],
      ctaLabel: 'Contact on Telegram',
      ctaHref: `${telegramUrl}`,
    },
    {
      title: '3 Months VIP',
      price: '999 MAD',
      priceNote: '/ 3 months',
      description: 'Whale Apprentice — best value',
      features: [
        'All Free signals included',
        'VIP exclusive signals 👑',
        'Real-time Telegram alerts',
        'Entry, Stop-Loss & Targets',
        'Contract address access',
        'Advanced risk analytics',
        'Priority support',
      ],
      isPopular: true,
      ctaLabel: 'Contact on Telegram',
      ctaHref: `${telegramUrl}`,
    },
    {
      title: '6 Months VIP',
      price: '1599 MAD',
      priceNote: '/ 6 months',
      description: 'Alpha Hunter — serious trader',
      features: [
        'All Free signals included',
        'VIP exclusive signals 👑',
        'Real-time Telegram alerts',
        'Entry, Stop-Loss & Targets',
        'Contract address access',
        'Advanced risk analytics',
        'Priority support',
      ],
      ctaLabel: 'Contact on WhatsApp',
      ctaHref: `${waBase}${encodeURIComponent('Hello, I want the 6 Months VIP plan.')}`,
    },
    {
      title: '1 Year VIP',
      price: '2999 MAD',
      priceNote: '/ year',
      description: 'The Ultimate Whale — elite access',
      features: [
        'All Free signals included',
        'VIP exclusive signals 👑',
        'Real-time Telegram alerts',
        'Entry, Stop-Loss & Targets',
        'Contract address access',
        'Advanced risk analytics',
        'Priority support',
        'Exclusive 1-on-1 strategy sessions',
      ],
      ctaLabel: 'Contact on WhatsApp',
      ctaHref: `${waBase}${encodeURIComponent('Hello, I want the 1 Year VIP plan.')}`,
    },
  ];

  return (
    <section
      className="relative w-full overflow-hidden py-24 md:py-32"
      ref={pricingRef}
    >
      <BackgroundBeams />

      <div className="container relative mx-auto px-6 max-w-[1400px]">
        {/* Section Header */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="mb-10 text-center sm:mb-16"
        >
          <h2 className="mb-6 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-4xl font-light tracking-tighter text-transparent md:text-6xl">
            Choose Your <span className="text-white font-medium">Plan</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-lg font-light tracking-wide text-zinc-400 leading-relaxed">
            Select the perfect plan for your crypto journey. All plans include our core features.
          </p>
        </motion.div>

        {/* Pricing Cards — 5 equal columns, all on same row */}
        <motion.div
          style={{ opacity: cardsOpacity, y: cardsY }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch"
        >
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
