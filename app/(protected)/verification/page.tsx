import Image from 'next/image';
import Link from 'next/link';

import { LogOut, MessageCircle, ShieldAlert } from 'lucide-react';

import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerificationPage() {
  const message = 'Hello, I need verification for my MemoMessi account.';

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#09090b]">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="MemoMessi"
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            <span className="text-xl font-light tracking-wider text-white">MemoMessi</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/privacy"
              className="text-sm font-medium tracking-wide text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium tracking-wide text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium tracking-wide text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative flex flex-grow flex-col items-center justify-center p-6">
        <div className="absolute inset-0 z-0">
           {/* Subtle center glow */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
           </div>
        </div>

        <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-2 backdrop-blur-xl shadow-2xl shadow-black/50">
          <CardHeader className="space-y-6 text-center pt-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
              <ShieldAlert className="h-10 w-10 text-orange-400" />
            </div>
            <CardTitle className="text-3xl font-light tracking-tighter text-white">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="text-center space-y-3">
              <p className="text-lg font-medium text-zinc-200">Your account needs to be activated</p>
              <p className="text-sm font-light tracking-wide leading-relaxed text-zinc-400 px-4">
                To securely access our institutional-grade signals and alpha tools, please contact our support team to verify your payment status.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8 px-6">
            <Button size="lg" asChild className="w-full relative overflow-hidden rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-300 backdrop-blur-md">
              <Link
                href={`https://wa.me/+21266666666?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contact via WhatsApp</span>
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="w-full rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
              <Link href="/login" className="flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Return to Login</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="absolute inset-0 pointer-events-none -z-10">
          <BackgroundBeams />
        </div>
      </div>
    </div>
  );
}
