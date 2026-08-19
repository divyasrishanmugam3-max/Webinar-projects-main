"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Ticket, Sparkles, ShieldCheck, ArrowRight, Download, Calendar, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { WEBINAR_DETAILS, Attendee } from '@/types/webinar';
import { generateICSFile } from '@/lib/ics';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  academyName: string;
}

export function RegistrationModal({ isOpen, onClose, academyName }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    qualification: '',
    currentStatus: '',
    courseInterest: '',
    mainGoal: '',
    role: '',
    source: 'Direct',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendeeTicket, setAttendeeTicket] = useState<Attendee | null>(null);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // simple phone validation (international digits, spaces, +, -)
    return /^\+?[0-9\s\-]{7,20}$/.test(phone);
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get('source');
      if (src) setFormData((s) => ({ ...s, source: src }));
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = String((formData as any)?.fullName || '').trim();
    const email = String((formData as any)?.email || '').trim();
    const phone = String((formData as any)?.phone || '').trim();

    if (!fullName || !email || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please provide a valid email address');
      return;
    }
    if (!validatePhone(phone)) {
      toast.error('Please provide a valid phone/WhatsApp number');
      return;
    }
    
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    setIsSubmitting(true);

    try {
  const payload = {
    full_name: fullName,
    whatsapp_number: phone,
    email: email,
    city: String((formData as any)?.city || '').trim(),
    qualification: String((formData as any)?.qualification || '').trim(),
    current_status: (formData as any)?.currentStatus || '',
    course_interest: (formData as any)?.courseInterest || '',
    main_goal: (formData as any)?.mainGoal || '',
    source: (formData as any)?.source || 'Direct',
    webinar_date: WEBINAR_DETAILS.dateTimeStr,
  };

  const res = await fetch(`https://dutxrxgwslbqlywnhrzj.supabase.co/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      // FIX 1: Forces Supabase to return the row data so data.id exists
      'Prefer': 'return=representation', 
    },
    body: JSON.stringify(payload),
  });

  // FIX 2: Safely parse JSON or fallback to an empty array/object
  let data: any = null;
  const responseText = await res.text();
  if (responseText) {
    try {
      data = JSON.parse(responseText);
      // Supabase returns an array of rows when using return=representation
      if (Array.isArray(data)) {
        data = data[0];
      }
    } catch (e) {
      console.error("Failed to parse response JSON", e);
    }
  }

  if (res.status === 201) {
    toast.success('Registration successful — redirecting...');
    setIsSubmitting(false);
    onClose();
    // Using the safely extracted ID from the array or payload fallback
    const insertedId = data?.id || '';
    router.push(`/thank-you?id=${insertedId}&name=${encodeURIComponent(payload.full_name)}`);
  } else if (res.status === 409) {
    toast.error(data?.message || 'You have already registered');
    setIsSubmitting(false);
  } else {
    toast.error(data?.message || 'Registration failed — please try again');
    setIsSubmitting(false);
  }
} catch (error) {
  // FIX 3: Check your browser console log to see if a real network block happened
  console.error("Actual Request Error Details:", error);
  toast.error('Network error — please try again');
  setIsSubmitting(false);
}
  };

  const handleDownloadICS = () => {
    generateICSFile({
      title: WEBINAR_DETAILS.title,
      description: `Free Python Full Stack + AI Career Masterclass hosted by ${academyName}. Ticket ID: ${attendeeTicket?.ticketNumber}`,
      location: WEBINAR_DETAILS.mode,
      startDate: new Date(WEBINAR_DETAILS.targetTimestamp),
      durationMinutes: 90,
    });
    toast.success('Calendar event (.ics) downloaded');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Webinar link copied to clipboard!');
  };

  const resetAndClose = () => {
    setAttendeeTicket(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      city: '',
      qualification: '',
      currentStatus: 'College Student',
      courseInterest: 'Full Stack Development + AI',
      mainGoal: 'Get a Job',
      role: 'student',
      source: 'Direct',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-border bg-card">
        {!attendeeTicket ? (
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
                  100% Free Registration
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Limited Seats
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold font-display tracking-tight text-foreground">
                Reserve Your Free Spot
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                Join <span className="font-semibold text-foreground">{academyName}</span> for the live webinar on{' '}
                <span className="font-medium text-foreground">{WEBINAR_DETAILS.dateTimeStr}</span>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Alex Rivera"
                  value={(formData as any).fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="bg-background border-input focus-visible:ring-primary h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={(formData as any).email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-background border-input focus-visible:ring-primary h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  WhatsApp / Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={(formData as any).phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="bg-background border-input focus-visible:ring-primary h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Status
                </Label>
                <select
                  id="role"
                  value={(formData as any).role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="student">College Student</option>
                  <option value="fresher">Fresh Graduate / Job Seeker</option>
                  <option value="career_switcher">Working Professional (Career Switcher)</option>
                  <option value="beginner">Beginner Interested in Coding</option>
                  <option value="developer">Aspiring Full Stack Developer</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all rounded-xl"
                >
                  {isSubmitting ? 'Generating Digital Pass...' : 'Confirm Free Registration →'}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Zero spam guarantee. Live link sent immediately.</span>
              </div>
            </form>
          </div>
        ) : (
          /* DIGITAL PASS / TICKET VIEW */
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <DialogTitle className="text-2xl font-bold font-display text-foreground">
                You&apos;re Registered!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Your entry ticket pass for <span className="text-foreground font-semibold">{academyName}</span> is confirmed.
              </DialogDescription>
            </div>

            {/* DIGITAL PASS CARD */}
            <div className="relative border-2 border-primary/40 bg-gradient-to-br from-card via-background to-card rounded-2xl p-5 shadow-lg overflow-hidden space-y-4">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  <span className="font-bold text-sm tracking-wider uppercase text-foreground">{academyName}</span>
                </div>
                <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                  {attendeeTicket.ticketNumber}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-foreground leading-snug">
                  {WEBINAR_DETAILS.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {WEBINAR_DETAILS.dateTimeStr}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Attendee</span>
                  <span className="font-semibold text-foreground truncate block">{attendeeTicket.fullName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Access Level</span>
                  <span className="font-semibold text-primary block">VIP Free Pass</span>
                </div>
              </div>

              <div className="bg-muted/60 rounded-lg p-3 text-center text-xs space-y-1 border border-border">
                <p className="text-muted-foreground font-medium">Join Link sent to <span className="text-foreground font-semibold">{attendeeTicket.email}</span></p>
                <p className="text-[11px] text-primary font-semibold">Please check your inbox & WhatsApp</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleDownloadICS}
                variant="outline"
                className="w-full gap-2 border-primary/30 hover:border-primary text-foreground"
              >
                <Calendar className="w-4 h-4 text-primary" />
                Add to Calendar
              </Button>
              <a
                href={WEBINAR_DETAILS.whatsAppGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm px-4 py-2 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
              >
                Join WhatsApp Group
              </a>
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border">
              <button onClick={handleCopyLink} className="hover:text-foreground flex items-center gap-1">
                <Copy className="w-3.5 h-3.5 text-primary" />
                Copy Webinar Link
              </button>
              <Button size="sm" variant="ghost" onClick={resetAndClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
