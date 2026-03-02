'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
  { name: 'About us', href: '#about-us' },
  { name: 'Services', href: '#services' },
  { name: 'Results', href: '#results' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact us', href: '#contact-us' },
];

export default function Navbar() {
  const { scrollToSection } = useSmoothScroll();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-black/20 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="hidden items-center gap-8 md:flex">
          {navigation.slice(0, 3).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative text-sm font-bold text-gray-300/90 transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:text-blue-400 hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="text-2xl font-light tracking-wider text-white transition-all duration-300 hover:text-blue-400"
        >
          <Image src="/logo.png" alt="MemoMessi" width={46} height={46} className="h-8 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.slice(3).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative text-sm font-bold text-gray-300/90 transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:text-blue-400 hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[200px] border-white/10 bg-black/80 backdrop-blur-lg"
          >
            {navigation.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="w-full text-sm font-light text-gray-300/90 transition-all duration-300 hover:text-blue-400"
                >
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
