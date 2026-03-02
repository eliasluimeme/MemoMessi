'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useSignup } from '@/hooks/use-signup';

import { BackgroundBeams } from '@/components/ui/background-beams';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

export default function SignupPage() {
  const { isLoading, handleSubmit } = useSignup();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background/80 relative overflow-hidden py-12">
      {/* Refined clean background atmosphere */}
      {/* <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" /> */}

      <div className="relative z-10 mx-auto w-full max-w-md rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-3xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <Image
          src="/logo.png"
          alt="MemoMessi Logo"
          width={100}
          height={100}
          className="mx-auto mb-8"
          priority
        />
        <h2 className="text-2xl font-light tracking-tight text-foreground text-center">
          Terminal Registration
        </h2>
        <p className="mt-2 text-sm text-muted-foreground font-light tracking-wide text-center">
          Initialize your institutional identity
        </p>

        <form className="my-10" onSubmit={handleSubmit}>
          <div className="mb-5 flex flex-col space-y-5 md:flex-row md:space-x-4 md:space-y-0">
            <LabelInputContainer>
              <Label htmlFor="fullname" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Operator Name</Label>
              <Input id="fullname" name="fullName" placeholder="John Doe" type="text" required className="h-12 bg-secondary/30 border-border/40 focus:border-primary/50 text-sm font-light" />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-5">
            <Label htmlFor="phonenumber" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Secure Comm (Phone)</Label>
            <Input
              id="phonenumber"
              name="phonenumber"
              placeholder="+1 234 567 890"
              type="tel"
              required
              className="h-12 bg-secondary/30 border-border/40 focus:border-primary/50 text-sm font-light"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-5">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Routing Address (Email)</Label>
            <Input
              id="email"
              name="email"
              placeholder="operator@station.com"
              type="email"
              required
              className="h-12 bg-secondary/30 border-border/40 focus:border-primary/50 text-sm font-light"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-5">
            <Label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Passphrase</Label>
            <Input id="password" name="password" placeholder="••••••••" type="password" required className="h-12 bg-secondary/30 border-border/40 focus:border-primary/50 text-sm font-light" />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Confirm Passphrase</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              required
              className="h-12 bg-secondary/30 border-border/40 focus:border-primary/50 text-sm font-light"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative flex items-center justify-center h-12 w-full rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Deploy Identity'}
          </button>
        </form>
        <div className="text-center pt-6 border-t border-border/40">
          <Link href="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            &larr; Return to Authentication
          </Link>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('flex w-full flex-col space-y-2', className)}>{children}</div>;
};
