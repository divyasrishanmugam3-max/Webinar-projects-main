'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, Zap, ShieldAlert, Award, TrendingUp } from 'lucide-react';

const BENEFITS = [
  {
    icon: Target,
    title: '360° Full Stack Mastery',
    description: 'Understand the end-to-end web architecture from HTML, CSS, JavaScript, React to Python, Django, and SQL.',
    stat: 'Frontend + Backend',
  },
  {
    icon: Zap,
    title: '10x Productivity with AI Tools',
    description: 'Learn how modern developers leverage AI co-pilots like Cursor, Copilot, and ChatGPT to build features faster.',
    stat: 'Modern Tooling',
  },
  {
    icon: Lightbulb,
    title: 'Real-World System Architecture',
    description: 'Discover how professional engineering teams design scalable databases, RESTful APIs, and secure auth systems.',
    stat: 'Industry Standards',
  },
  {
    icon: ShieldAlert,
    title: 'Avoid Common Beginner Pitfalls',
    description: 'Skip tutorial hell and learn the exact sequence of skills tech employers look for during technical interviews.',
    stat: 'Proven Strategy',
  },
  {
    icon: TrendingUp,
    title: '2026 Tech Job Market Insights',
    description: 'Get honest, realistic analysis on tech hiring trends, portfolio expectations, and salary benchmarks.',
    stat: 'Market Reality',
  },
  {
    icon: Award,
    title: 'Verified Digital Participation Certificate',
    description: 'Receive an official certificate of attendance from our academy upon live webinar completion.',
    stat: 'Certificate Included',
  },
];

export function WhyAttend() {
  return (
    <section className="py-16 md:py-24 bg-card/30 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
            Key Advantages
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
            Why Should You Attend This Webinar?
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Here are 6 key reasons why spending 90 minutes with us will accelerate your software engineering journey.
          </p>
        </div>

        {/* BENEFIT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className="group border-border/80 hover:border-primary/50 bg-card hover:bg-card/90 transition-all rounded-2xl overflow-hidden p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
                      {benefit.stat}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
