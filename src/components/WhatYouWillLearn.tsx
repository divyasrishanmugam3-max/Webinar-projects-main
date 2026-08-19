'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Layers, Cpu, Wrench, Rocket, Compass, CheckCircle } from 'lucide-react';

const LEARNING_MODULES = [
  {
    icon: Compass,
    title: 'Python Full Stack Roadmap',
    description: 'Step-by-step career path from initial fundamentals to production-grade architecture in 2026.',
    highlights: ['Core Python & OOP Principles', 'Data Structures for Engineering', 'Backend Ecosystem Selection'],
    badge: 'Core Foundation',
  },
  {
    icon: Layers,
    title: 'Frontend & Backend Fundamentals',
    description: 'How modern web applications function under the hood with HTML/CSS, React, REST APIs, and Django/FastAPI.',
    highlights: ['Responsive UI with React & Tailwind', 'RESTful API & Database Integration', 'State & Authentication Control'],
    badge: 'Full Stack Tech',
  },
  {
    icon: Cpu,
    title: 'How AI is Changing Software Dev',
    description: 'Understanding the shift in developer workflows, rapid prototyping, and automated code generation.',
    highlights: ['AI-Augmented Development Cycle', 'Prompt Engineering for Engineers', 'Debugging with LLMs'],
    badge: 'Industry Trends',
  },
  {
    icon: Wrench,
    title: 'AI Tools Used by Developers',
    description: 'Hands-on look at Cursor, GitHub Copilot, Claude, and ChatGPT integrated into real-world workflows.',
    highlights: ['IDE AI Integration Mastery', 'Automated Test Generation', 'Refactoring & Doc Generation'],
    badge: 'Practical Tools',
  },
  {
    icon: Rocket,
    title: 'Real-World Project Blueprint',
    description: 'Deconstruct a full-stack AI project from initial wireframe to cloud deployment and monitoring.',
    highlights: ['System Architecture Design', 'Database Modeling (PostgreSQL)', 'Deployment Pipelines'],
    badge: 'Hands-on Project',
  },
  {
    icon: Code2,
    title: 'Career & Learning Blueprint',
    description: 'Actionable strategy for job placement, resume tailoring, portfolio creation, and technical interview prep.',
    highlights: ['High-Impact GitHub Portfolio', 'Technical Interview Prep', 'Salary Negotiation Strategies'],
    badge: 'Career Success',
  },
];

export function WhatYouWillLearn() {
  return (
    <section id="curriculum" className="py-16 md:py-24 bg-card/40 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
            Comprehensive Masterclass Curriculum
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
            What You Will Learn in 90 Minutes
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Gain a clear, structured understanding of modern full-stack development combined with practical AI productivity tools.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARNING_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.title}
                className="group relative border-border/80 hover:border-primary/50 bg-card hover:bg-card/90 transition-all shadow-sm hover:shadow-md rounded-2xl overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-semibold text-muted-foreground">
                      {module.badge}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-border/60">
                    {module.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
