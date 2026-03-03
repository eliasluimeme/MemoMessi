'use client';

import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    window.open('https://wa.me/000000000', '_blank');
  };

  return (
    <div className="container mx-auto">
      <div className="space-y-8 py-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Other Ways to Reach Us</h2>
              <p className="text-muted-foreground">
                Prefer to chat directly? Connect with us on WhatsApp for immediate assistance.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={handleWhatsAppClick}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </Button>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-semibold">Business Hours</h3>
              <div className="text-sm text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
