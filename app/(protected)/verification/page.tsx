import Image from 'next/image';
import Link from 'next/link';

import { LogOut, MessageCircle, ShieldAlert } from 'lucide-react';

import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerificationPage() {
  const message = 'Hello, I need verification for my MemoMessi whales account.';

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-secondary"
          >
            <Image
              src="/logo.png"
              alt="MemoMessi"
              width={32}
              height={32}
              priority
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">MemoMessi</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Card className="w-full max-w-md shadow-none">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Account Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="mb-2 text-lg">Your account needs payment verification</p>
              <p className="text-sm text-muted-foreground">
                Please contact our support team to complete your verification process
              </p>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button size="lg" asChild variant="success" className="flex-1 px-0">
              <Link
                href={`https://wa.me/00000000?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle />
                Contact Support on WhatsApp
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <BackgroundBeams />
      </div>
    </>
  );
}
