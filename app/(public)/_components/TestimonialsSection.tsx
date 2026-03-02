'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';

const CardGradient = () => {
  return (
    <>
      {/* Bottom gradient */}
      <span className="absolute inset-x-0 -bottom-px z-[1] block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px z-[1] mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />

      {/* Top gradient */}
      <span className="absolute inset-x-0 -top-px z-[1] block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -top-px z-[1] mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />

      {/* Left gradient */}
      <span className="absolute inset-y-0 -left-px z-[1] block h-full w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
      <span className="absolute inset-y-10 -left-px z-[1] my-auto block h-1/2 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />

      {/* Right gradient */}
      <span className="absolute inset-y-0 -right-px z-[1] block h-full w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
      <span className="absolute inset-y-10 -right-px z-[1] my-auto block h-1/2 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />

      {/* Glow overlay */}
      <span className="absolute inset-0 z-[1] block rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />
    </>
  );
};

const testimonials = [
  {
    quote:
      "Wallah, I was hesitant at first, but their portfolio analysis saved me during the crypto crash. They helped me restructure everything and alhamdulillah, I've seen a 40% return since then. Their approach to managing risk is exactly what I needed.",
    author: 'Youssef El Mansouri',
    company: 'Tech Entrepreneur, Casablanca',
  },
  {
    quote:
      'Their weekly market reports are gold, mashallah! Last month, they predicted the ALT coins surge and I jumped in early. Now my digital assets is worth 3x what I invested. The analysis is always spot on.',
    author: 'Fatima Bennis',
    company: 'Digital Investor, Rabat',
  },
  {
    quote:
      "I started from zero in crypto six months ago. Their step-by-step training was perfect - they even explained everything in Darija when I needed it. Now I'm confidently trading on multiple platforms, alhamdulillah.",
    author: 'Karim Tazi',
    company: 'Shop Owner, Marrakech',
  },
  {
    quote:
      "Managing my family's savings in crypto was giving me sleepless nights until I found MemoMessi. They helped me diversify across different coins and platforms. Even my conservative father is impressed with the returns!",
    author: 'Omar El Fassi',
    company: 'Family Business Owner, Tangier',
  },
  {
    quote:
      'Their mining consultation was exactly what I needed. They helped me set up everything properly in my phone.',
    author: 'Mehdi karmi',
    company: 'Mining Operator, Oujda',
  },
  {
    quote:
      "Launching our NFT project for traditional Moroccan art seemed impossible at first. But mashallah, with their guidance on smart contracts and marketing, we've successfully brought our heritage to the blockchain.",
    author: 'Leila Yassin',
    company: 'Art Curator, Fes',
  },
  {
    quote:
      'Security is everything in crypto. After trying different services, their cold storage setup and security protocols are the best. Finally, I can sleep knowing my investments are safe, alhamdulillah.',
    author: 'Hamza Bada',
    company: 'Early Crypto Adopter, Agadir',
  },
  {
    quote:
      'The situation with crypto was so complicated until they helped me organize everything. They understand both Moroccan regulations and international laws. Worth every dirham.',
    author: 'Amina Brija',
    company: 'Business Consultant, Kenitra',
  },
  {
    quote:
      "Their trading signals are incredible, mashallah! I've maintained a 120% return following their strategy. The weekly calls in Darija make everything so clear and easy to follow.",
    author: 'Rachid Benjelloun',
    company: 'Full-time Trader, Tetouan',
  },
  {
    quote:
      "I was worried about investing in DeFi until they showed me the right way. Started with stable coins, now I'm exploring more strategies. Everything is explained clearly with Islamic finance in mind.",
    author: 'Nadia El Hamdaoui',
    company: 'Islamic Finance Expert, Meknes',
  },
];

const TestimonialCard = ({ index }: { index: number }) => {
  const testimonial = testimonials[index % testimonials.length];

  return (
    <div className="group relative w-[280px] shrink-0 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 via-white/10 to-white/5 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-transparent hover:shadow-[0_0_30px_4px_rgba(59,130,246,0.1)] sm:w-[340px] sm:p-8 md:w-[400px]">
      <CardGradient />
      {/* Glass Effects */}
      <div className="absolute -inset-[1px] -z-10 rounded-3xl bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />
      <div className="absolute -inset-[2px] -z-10 rounded-3xl bg-gradient-to-t from-blue-500/5 via-transparent to-blue-300/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Quote Icon */}
      <div className="mb-4 sm:mb-6">
        <div className="inline-block rounded-full bg-blue-500/5 p-2.5 transition-colors duration-500 group-hover:bg-blue-500/10 sm:p-3.5">
          <svg
            className="h-4 w-4 text-blue-400 transition-colors duration-500 group-hover:text-blue-300 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10.5h-.13C6.4 10.5 5 9.1 5 7.375S6.4 4.25 7.87 4.25c1.47 0 2.63 1.4 2.63 3.125C10.5 12.25 5 16 5 16m8-5.5h-.13c-1.47 0-2.87-1.4-2.87-3.125S11.4 4.25 12.87 4.25c1.47 0 2.63 1.4 2.63 3.125C15.5 12.25 10 16 10 16"
            />
          </svg>
        </div>
      </div>

      {/* Testimonial Content */}
      <blockquote className="mb-6 sm:mb-8">
        <p className="text-sm font-light leading-relaxed text-gray-300 transition-colors duration-500 group-hover:text-white sm:text-lg">
          &quot;{testimonial.quote}&quot;
        </p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 transition-all duration-500 group-hover:from-blue-400/20 group-hover:to-blue-600/20 sm:h-12 sm:w-12">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-400/5 to-blue-600/5 p-1 transition-all duration-500 group-hover:from-blue-400/10 group-hover:to-blue-600/10">
            <div className="h-full w-full rounded-full bg-blue-950/50 transition-colors duration-500 group-hover:bg-blue-900/50" />
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-white sm:text-base">{testimonial.author}</div>
          <div className="text-xs text-gray-400 transition-colors duration-500 group-hover:text-gray-300 sm:text-sm">
            {testimonial.company}
          </div>
        </div>
      </div>
    </div>
  );
};

export function TestimonialsSection() {
  const testimonialsRef = useRef(null);
  const { scrollYProgress: testimonialsScrollProgress } = useScroll({
    target: testimonialsRef,
    offset: ['start end', 'end start'],
  });

  // Smoother easing function for scroll animations
  const smoothTransform = (progress: number) => {
    return 1 - Math.pow(1 - progress, 3); // Cubic easing
  };

  // Testimonials animations - slower and smoother
  const testimonialsTitleOpacity = useTransform(
    testimonialsScrollProgress,
    [0, 0.2, 0.4, 0.6],
    [0, 0.3, 0.7, 1],
    { ease: smoothTransform },
  );

  const testimonialsTitleY = useTransform(testimonialsScrollProgress, [0, 0.6], [150, 0], {
    ease: smoothTransform,
  });

  const testimonialsDescriptionOpacity = useTransform(
    testimonialsScrollProgress,
    [0.1, 0.3, 0.5, 0.7],
    [0, 0.3, 0.7, 1],
    { ease: smoothTransform },
  );

  const testimonialsDescriptionY = useTransform(testimonialsScrollProgress, [0.1, 0.7], [120, 0], {
    ease: smoothTransform,
  });

  return (
    <section
      id="testimonials"
      className="relative min-h-[80vh] w-full overflow-hidden sm:min-h-screen"
      ref={testimonialsRef}
    >
      <div className="container relative mx-auto px-4 py-12 sm:py-24">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-20">
          <motion.h2
            style={{
              opacity: testimonialsTitleOpacity,
              y: testimonialsTitleY,
            }}
            className="mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
          >
            What Our <span className="gradient-text">Clients </span>Say
          </motion.h2>
          <motion.p
            style={{
              opacity: testimonialsDescriptionOpacity,
              y: testimonialsDescriptionY,
            }}
            className="mx-auto max-w-2xl text-base font-light text-gray-400 sm:text-lg"
          >
            Discover why leading investors choose MemoMessi for their digital asset investments.
          </motion.p>
        </div>

        {/* Floating Glow Circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-64 w-64 rounded-full bg-blue-500/20 blur-[100px] sm:h-96 sm:w-96"
          />
        </div>

        {/* Testimonials Slider */}
        <div className="relative overflow-hidden p-4 sm:p-6">
          <motion.div
            className="flex gap-4 sm:gap-6"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            }}
          >
            {/* First set of cards */}
            {[1, 2, 3, 4, 5].map((index) => (
              <TestimonialCard key={index} index={index} />
            ))}

            {/* Duplicate cards for seamless loop */}
            {[1, 2, 3, 4, 5].map((index) => (
              <TestimonialCard key={`duplicate-${index}`} index={index} />
            ))}

            {/* Second duplicate set for extra smoothness */}
            {[1, 2, 3, 4, 5].map((index) => (
              <TestimonialCard key={`duplicate2-${index}`} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
