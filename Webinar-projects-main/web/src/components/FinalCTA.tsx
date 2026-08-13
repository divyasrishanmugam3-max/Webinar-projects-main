'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WEBINAR_DETAILS } from '@/types/webinar';

interface FinalCTAProps {
  academyName: string;
  onRegisterClick: () => void;
}

export function FinalCTA({ academyName, onRegisterClick }: FinalCTAProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-card/80 to-background relative overflow-hidden">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Don&apos;t Miss Out • Live Interactive Session</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-foreground leading-tight">
            Reserve My <span className="text-primary underline decoration-primary/30 underline-offset-8">Free Seat</span> Today
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Take the first definitive step toward mastering Python Full Stack development and AI workflows with <span className="text-foreground font-semibold">{academyName}</span>.
          </p>
        </div>

        {/* DETAILS BAR */}
        <div className="inline-flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-md text-xs sm:text-sm font-semibold text-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{WEBINAR_DETAILS.dateTimeStr}</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>90 Minutes • Live Online</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border hidden sm:block" />
          <div className="text-primary font-bold">100% Free VIP Access</div>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            onClick={onRegisterClick}
            size="lg"
            className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
          >
            Reserve My Free Seat Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <a
            href={WEBINAR_DETAILS.whatsAppGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center font-bold text-base rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-md hover:scale-[1.02]"
          >
            Join on WhatsApp
          </a>
        </div>

        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>No credit card required. Instant ticket confirmation sent via email & WhatsApp.</span>
        </p>

      </div>
    </section>
  );
}
