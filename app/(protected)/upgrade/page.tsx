import Image from 'next/image';
import Link from 'next/link';
import { Check, Crown, Lock, Zap } from 'lucide-react';

export default function UpgradePage() {
  return (
    <main className="min-h-screen dark:bg-black/60 bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Crown className="h-3.5 w-3.5" /> Upgrade to VIP
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Unlock Full Access
          </h1>
          <p className="text-muted-foreground/60 max-w-xl mx-auto text-sm leading-relaxed">
            Get unlimited access to all VIP signals, real-time alerts, and exclusive market intelligence.
          </p>
        </div>

        {/* Tier comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Tier */}
          <div className="rounded-2xl border border-border/60 dark:border-white/[0.06] bg-card dark:bg-white/[0.02] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center">
                <Zap className="h-4.5 w-4.5 text-muted-foreground/60" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Free Tier</h2>
                <p className="text-xs text-muted-foreground/60">Your current plan</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                'Access to all free signals',
                'Basic market access',
                'Signal status updates',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-muted-foreground/70">
                  <Check className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                  {f}
                </li>
              ))}
              {[
                'VIP exclusive signals',
                'Unlimited signal access',
                'Priority Telegram alerts',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-muted-foreground/40 line-through">
                  <Lock className="h-4 w-4 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* VIP Tier */}
          <div className="rounded-2xl border border-amber-500/20 dark:border-amber-500/30 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] p-6 space-y-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
              Recommended
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Crown className="h-4.5 w-4.5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">VIP Tier</h2>
                <p className="text-xs text-amber-400/70">Full access</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                'Unlimited signal access',
                'All VIP exclusive signals',
                'Real-time Telegram alerts',
                'Priority support',
                'All free tier features',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-foreground/80">
                  <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground/60">
            To upgrade, contact the admin via Telegram or WhatsApp. Your account will be activated within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://t.me/khalid12303"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold hover:bg-sky-500/20 transition-colors"
            >
              Contact on Telegram
            </a>
            {/* <a
              href="https://wa.me/+212721220118?text=Hello, I want to upgrade to VIP plan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              Contact on WhatsApp
            </a> */}
          </div>
          <p className="text-xs text-muted-foreground/40 mt-2">
            Already contacted?{' '}
            <Link href="/signals" className="text-primary hover:underline">
              Go back to signals
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

