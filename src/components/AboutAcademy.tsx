'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Award, Users, BookOpen, Building2, CheckCircle2 } from 'lucide-react';
import { AcademyInfo } from '@/types/webinar';

interface AboutAcademyProps {
  academy: AcademyInfo;
}

export function AboutAcademy({ academy }: AboutAcademyProps) {
  return (
    <section id="academy" className="py-16 md:py-24 bg-card/30 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
                About the Academy
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
                Welcome to <span className="text-primary">{academy.name}</span>
              </h2>
              <p className="text-lg font-semibold text-foreground/90">
                {academy.tagline}
              </p>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We are a dedicated IT career accelerator focusing on outcome-oriented engineering education. Our mission is to bridge the gap between academic education and modern industry demands through live interactive masterclasses, practical full-stack projects, and personalized mentorship.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <BookOpen className="w-4 h-4" /> Curriculum Excellence
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Regularly updated course structures covering current frameworks, AI developer tooling, and cloud infrastructure.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                  <Award className="w-4 h-4" /> Career Outcomes
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hands-on portfolio construction, resume reviews, technical interview prep, and placement guidance.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Live Interactive Classes
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Industry-Active Mentors
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Project-Driven Approach
              </div>
            </div>
          </div>

          {/* RIGHT BADGE CARD */}
          <div className="lg:col-span-5">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-card via-background to-card rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center">
                  {academy.logoIcon}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-foreground">{academy.name}</h3>
                  <p className="text-xs text-muted-foreground">Certified IT Education Center</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Learning Methodology</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Blend of live instructor-led masterclasses, practical coding assignments, and direct Q&A support.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Quality Guarantee</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Strict emphasis on clean code standards, real-world API integration, and production deployment.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <span className="text-xs font-bold text-primary block">Free Community Access Included</span>
                <span className="text-[11px] text-muted-foreground">Get access to coding templates & webinar resources</span>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
}
