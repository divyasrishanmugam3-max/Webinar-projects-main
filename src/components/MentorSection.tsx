'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Award, Briefcase, GraduationCap, CheckCircle2, Linkedin, Terminal, Sparkles } from 'lucide-react';

export function MentorSection() {
  return (
    <section id="mentor" className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
            Webinar Instructor & Industry Mentor
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
            Learn From an Experienced Software Architect
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Direct practical guidance from an engineer who has built scalable enterprise systems and trained over 5,000+ developers.
          </p>
        </div>

        {/* SPEAKER CARD */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/30 bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* AVATAR & QUICK STATS */}
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/10 p-1 border-2 border-primary/40 shadow-inner flex items-center justify-center">
                  <div className="w-full h-full rounded-xl bg-muted/80 flex flex-col items-center justify-center text-muted-foreground space-y-2 border border-border">
                    <UserCheck className="w-16 h-16 text-primary/80" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Instructor Photo Placeholder
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-display text-foreground">
                    Senior Technical Lead / Mentor
                  </h3>
                  <p className="text-xs font-semibold text-primary">
                    10+ Years Industry Experience
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px]">
                    Ex-Tech Lead @ Tier-1 Tech Firm
                  </Badge>
                </div>
              </div>

              {/* BIO & CREDENTIALS */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-accent uppercase tracking-widest block">
                    Speaker Bio & Background
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A passionate full-stack software architect specializing in Python microservices, React frontends, and AI agent integration. Over the past decade, has designed distributed cloud systems handling millions of daily API calls and mentored thousands of students from zero coding knowledge to high-paying engineering careers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-background border border-border flex items-start gap-2.5">
                    <Briefcase className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-foreground block">Enterprise Architecture</span>
                      <span className="text-[11px] text-muted-foreground">Python, Django, FastAPI, React & Cloud</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-background border border-border flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-foreground block">5,000+ Students Mentored</span>
                      <span className="text-[11px] text-muted-foreground">Structured coding bootcamps & webinars</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Core Expertise:</span>
                  <span className="px-2 py-0.5 rounded bg-muted/80 text-[11px] text-foreground font-mono">Python</span>
                  <span className="px-2 py-0.5 rounded bg-muted/80 text-[11px] text-foreground font-mono">Django</span>
                  <span className="px-2 py-0.5 rounded bg-muted/80 text-[11px] text-foreground font-mono">React</span>
                  <span className="px-2 py-0.5 rounded bg-muted/80 text-[11px] text-foreground font-mono">AI Developer Tooling</span>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </section>
  );
}
