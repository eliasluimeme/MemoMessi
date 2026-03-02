'use client';

import { useCallback } from 'react';

export function useSmoothScroll() {
  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === 'undefined') return;

    const element = document.querySelector(sectionId);
    if (!element) return;

    const navbarHeight = 80; // Height of the fixed navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }, []);

  return { scrollToSection };
} 