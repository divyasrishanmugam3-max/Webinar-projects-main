'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, RefreshCw, Code, Sparkles, ArrowRight } from 'lucide-react';

const AUDIENCE_PROFILES = [
  {
    icon: GraduationCap,
    title: 'College Students',
    subtitle: 'CS, IT, Engineering & Non-CS Majors',
    description: 'Build high-impact industry projects that stand out in campus placements and off-campus recruitment drives.',
    takeaway: 'Placement Readiness & Project Blueprint',
    badge: 'Students',
  },
  {
    icon: Briefcase,
    title: 'Fresh Graduates / Job Seekers',
    subtitle: 'Pass-outs Seeking IT Roles',
    description: 'Bridge the gap between academic theory and practical full-stack coding demands expected by recruiters.',
    takeaway: 'Practical Skills & Industry Portfolio',
    badge: 'Freshers',
  },
  {
    icon: RefreshCw,
    title: 'Career Switchers',
    subtitle: 'Non-IT / Tech Support to Dev',
    description: 'Transition smoothly into software engineering with a structured learning roadmap tailored for working adults.',
    takeaway: 'Structured Transition Strategy',
    badge: 'Professionals',
  },
  {
    icon: Code,
    title: 'Coding Beginners',
    subtitle: 'Zero Prior Coding Experience',
    description: 'Start from fundamental building blocks with clear explanations, step-by-step guidance, and real examples.',
    takeaway: 'Solid Foundation Without Fear',
    badge: 'Beginners',
  },
  {
    icon: Sparkles,
    title: 'Aspiring Developers',
    subtitle: 'Self-Taught & Hobbyists',
    description: 'Elevate your existing coding knowledge with modern AI productivity workflows and cloud deployment practices.',
    takeaway: 'Modern Tooling & AI Workflows',
    badge: 'Developers',
  },
];

interface WhoShouldAttendProps {
  onRegisterClick: () => void;
}

export function WhoShouldAttend({ onRegisterClick }: WhoShouldAttendProps) {
  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
            Tailored Learning Paths
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
            Who Should Attend This Free Webinar?
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Designed to deliver actionable value whether you are taking your first step in programming or looking to upgrade your tech career.
          </p>
        </div>

        {/* AUDIENCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUDIENCE_PROFILES.map((profile) => {
            const Icon = profile.icon;
            return (
              <Card
                key={profile.title}
                className="group relative border-border/80 hover:border-primary/50 bg-card hover:bg-card/90 transition-all rounded-2xl p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-medium text-muted-foreground">
                      {profile.badge}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                      {profile.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary/80">
                      {profile.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {profile.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="text-muted-foreground">Key Benefit:</span>
                  <span className="text-primary">{profile.takeaway}</span>
                </div>
              </Card>
            );
          })}

          {/* QUICK CTA CALLOUT BOX */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground text-xs">
                Free Lifetime Insight
              </Badge>
              <h3 className="text-xl font-bold font-display text-foreground">
                Fits Your Goal?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Join thousands of learners who started their full-stack journey through our structured webinar series.
              </p>
            </div>

            <button
              onClick={onRegisterClick}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Reserve Free Seat Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
