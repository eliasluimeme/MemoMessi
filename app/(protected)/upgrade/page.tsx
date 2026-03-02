import Image from 'next/image';

import { PricingSection } from '@/app/(public)/_components/PricingSection';

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-black/60">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center">
          <a href="/" aria-label="Home">
            <Image src="/logo.png" alt="MemoMessi Whales" width={150} height={64} className="h-16 w-auto" />
          </a>
        </div>
      </div>
      <PricingSection />
    </main>
  );
}
