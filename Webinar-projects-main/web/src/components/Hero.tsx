'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Users, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WEBINAR_DETAILS } from '@/types/webinar';

interface HeroProps {
  academyName: string;
  tagline: string;
  onRegisterClick: () => void;
}

export function Hero({ academyName, tagline, onRegisterClick }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = WEBINAR_DETAILS.targetTimestamp - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="overview" className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-gradient-to-b from-background via-card/50 to-background border-b border-border/50">
      
      {/* Background Subtle Accent Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: INTRO & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* BADGES */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold border-primary/40 bg-primary/10 text-primary rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Live Masterclass Series
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs font-medium text-muted-foreground rounded-full">
                Presented by {academyName}
              </Badge>
            </div>

            {/* MAIN TITLE */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold font-display tracking-tight text-foreground leading-[1.12]">
                Free <span className="text-primary underline decoration-primary/30 underline-offset-8">Python Full Stack</span> + AI Career Webinar
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {WEBINAR_DETAILS.subtitle}
              </p>
            </div>

            {/* QUICK METADATA GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4" /> Date & Time
                </div>
                <div className="text-sm font-bold text-foreground">Aug 16 • 7:00 PM IST</div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4" /> Duration & Mode
                </div>
                <div className="text-sm font-bold text-foreground">90 Mins • Live Online</div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                  <Video className="w-4 h-4" /> Access Fee
                </div>
                <div className="text-sm font-bold text-primary flex items-center gap-1">
                  100% Free Pass <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                onClick={onRegisterClick}
                size="lg"
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.01]"
              >
                Register Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <a
                href={WEBINAR_DETAILS.whatsAppGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 px-6 inline-flex items-center justify-center font-bold text-base rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-md hover:scale-[1.01]"
              >
                Join on WhatsApp
              </a>
            </div>

            {/* TRUST GUARANTEE */}
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Zero Cost • No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent" />
                <span>Interactive Live Q&A</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: COUNTDOWN TIMER & CARD */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 rounded-2xl border-2 border-primary/30 bg-card/90 shadow-xl backdrop-blur-md space-y-6 relative">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest block">Live Webinar Starts In</span>
                  <h3 className="text-lg font-bold text-foreground font-display">Countdown to Live Event</h3>
                </div>
                <Badge className="bg-primary/10 text-primary border border-primary/20">
                  Seats Filling Fast
                </Badge>
              </div>

              {/* TIMER DISPLAY */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-background border border-border p-3 rounded-xl">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-foreground block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Days</span>
                </div>
                <div className="bg-background border border-border p-3 rounded-xl">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-foreground block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Hours</span>
                </div>
                <div className="bg-background border border-border p-3 rounded-xl">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-foreground block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Mins</span>
                </div>
                <div className="bg-background border border-border p-3 rounded-xl">
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-primary block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Secs</span>
                </div>
              </div>

              {/* HIGHLIGHT BOX */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Key Webinar Takeaway
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Learn how modern full-stack engineers combine Python, React, and AI co-pilots to build complete web applications in hours instead of weeks.
                </p>
              </div>

              <Button
                onClick={onRegisterClick}
                className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                Claim Your Free Ticket Pass
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
