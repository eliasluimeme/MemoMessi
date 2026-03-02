'use client';

import { useEffect, useState } from 'react';
import type { UserResponse } from '@/app/api/user/route';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Bell, CreditCard, Pencil, Settings2, ArrowUpRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfileEditForm } from '@/components/ui/profile-edit-form';

const plans: Record<string, string> = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
};

function formatPhoneNumber(phoneNumber: string | null): string {
  if (!phoneNumber) return '';
  try {
    const numberWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const parsedNumber = parsePhoneNumberFromString(numberWithPlus);
    return parsedNumber ? parsedNumber.formatInternational() : phoneNumber;
  } catch {
    return phoneNumber;
  }
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleSubmit(formData: { fullName: string; phoneNumber: string }) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await res.json();
      setUserData(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading)
    return (
      <div className="container mx-auto max-w-[1400px] px-6 md:px-12 py-12">
        <div className="animate-pulse space-y-12">
          <div className="h-20 w-1/3 bg-muted rounded-xl" />
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 h-96 bg-muted rounded-3xl" />
            <div className="lg:col-span-4 h-96 bg-muted rounded-3xl" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container flex h-[50vh] items-center justify-center">
        <div className="text-destructive font-light tracking-wide">{error}</div>
      </div>
    );

  if (!userData) return null;

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-[10px] uppercase tracking-widest font-semibold border border-border/50">
              Operator Profile
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground flex items-center gap-4">
              Identity
            </h1>
            <p className="text-muted-foreground/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Manage your institutional identity and system-wide operational preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="h-full rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-xl p-10 lg:p-12 flex flex-col">
              <div className="mb-12 flex items-center justify-between">
                <h2 className="text-sm font-medium tracking-tight text-muted-foreground">
                  {isEditing ? 'Modification Sequence' : 'Verified Overview'}
                </h2>
                {isEditing && (
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Edit Mode
                  </div>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <ProfileEditForm
                    initialData={{
                      fullName: userData.fullName,
                      phoneNumber: userData.phoneNumber || '',
                    }}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                    isSaving={isSaving}
                  />
                ) : (
                  <div className="space-y-16">
                    <div className="flex items-center gap-8">
                      <Avatar className="h-32 w-32 border border-border/50 text-2xl font-light">
                        {userData.image ? (
                          <AvatarImage src={userData.image} alt={userData.fullName} />
                        ) : null}
                        <AvatarFallback className="bg-secondary text-foreground">
                          {userData.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-light tracking-tight">{userData.fullName}</h3>
                        <div className="flex flex-col gap-1 text-muted-foreground">
                          <p className="text-sm tracking-wide">{userData.email}</p>
                          {userData.phoneNumber && (
                            <p className="text-sm tracking-wide font-mono">
                              {formatPhoneNumber(userData.phoneNumber)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-border/40">
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Tier</div>
                        <div className="inline-flex items-center gap-2 text-sm text-foreground font-medium">
                          <Shield className="w-4 h-4 text-primary" />
                          {userData.subscriptions?.plan
                            ? plans[userData.subscriptions.plan]
                            : 'Standard Access'}
                        </div>
                      </div>
                      {userData.subscriptions && (
                        <div className="space-y-2">
                          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Valid Through</div>
                          <div className="text-sm font-mono text-foreground font-medium">
                            {new Date(userData.subscriptions.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-xl p-8 space-y-6">
                <h2 className="text-sm font-medium tracking-tight text-muted-foreground mb-4">System Controls</h2>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-14 px-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 text-sm font-light transition-all"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <span className="flex items-center gap-3">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </span>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between h-14 px-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 text-sm font-light transition-all" asChild>
                    <a href="/upgrade">
                      <span className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Upgrade Access
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
                    </a>
                  </Button>

                  <Button variant="ghost" className="w-full justify-between h-14 px-6 rounded-2xl bg-secondary/30 hover:bg-secondary/60 text-sm font-light transition-all">
                    <span className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      Notifications
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 text-sm text-primary/80 font-light leading-relaxed">
                <Settings2 className="w-5 h-5 mb-3" />
                Connection secured. Local session active. For high-priority intervention, ping system ops.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
