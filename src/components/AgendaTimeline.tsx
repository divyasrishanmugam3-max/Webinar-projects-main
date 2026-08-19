'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Code, Cpu, Layers, Rocket, HelpCircle, CheckCircle2 } from 'lucide-react';

const AGENDA_TIMELINE = [
  {
    time: '00 - 15 Mins',
    title: 'Welcome & State of IT Industry 2026',
    icon: Clock,
    summary: 'Opening remarks, high-level overview of hiring trends in software engineering, and the rising demand for Python full-stack developers.',
    points: ['Industry hiring trends', 'Why Python remains top choice', 'Overview of 90-min roadmap'],
  },
  {
    time: '15 - 35 Mins',
    title: 'Python Full Stack Architecture Unpacked',
    icon: Layers,
    summary: 'Deconstructing the web development stack: Frontend (HTML, CSS, JS, React) seamlessly connected to Backend (Python, Django/FastAPI) and PostgreSQL databases.',
    points: ['Frontend vs Backend responsibilities', 'REST API design patterns', 'Database ORMs explained simply'],
  },
  {
    time: '35 - 55 Mins',
    title: 'How AI Tools Are Transforming Coding Workflows',
    icon: Cpu,
    summary: 'Live demonstration of developer AI tools (Cursor, Copilot, ChatGPT API). See how AI handles repetitive boilerplate while engineers focus on high-level logic.',
    points: ['AI-driven code generation', 'Automated debugging & refactoring', 'Prompting best practices for devs'],
  },
  {
    time: '55 - 75 Mins',
    title: 'Real-World Project & Portfolio Roadmap',
    icon: Code,
    summary: 'Walking through a production-ready full-stack AI project. Learn how to present projects on GitHub to attract recruiters.',
    points: ['Project structure walkthrough', 'GitHub repository optimization', 'Deploying live to cloud platforms'],
  },
  {
    time: '75 - 90 Mins',
    title: 'Live Q&A & Action Plan for Learners',
    icon: Rocket,
    summary: 'Interactive session answering audience questions on career switching, campus placements, certifications, and academy programs.',
    points: ['Live student Q&A', 'Step-by-step next steps', 'Exclusive webinar attendee perks'],
  },
];

export function AgendaTimeline() {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  return (
    <section id="agenda" className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
            90-Minute Detailed Schedule
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
            Webinar Session Agenda
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Every minute is packed with structured insights and actionable career guidance.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="relative border-l-2 border-primary/30 ml-4 sm:ml-32 space-y-8 pl-6 sm:pl-8">
          {AGENDA_TIMELINE.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activeItem === idx;

            return (
              <div
                key={item.title}
                onMouseEnter={() => setActiveItem(idx)}
                onMouseLeave={() => setActiveItem(null)}
                className="relative group cursor-pointer transition-all"
              >
                {/* TIME BADGE FOR DESKTOP LEFT */}
                <div className="hidden sm:block absolute -left-36 top-1 text-right w-28">
                  <span className="inline-block px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-card border border-border text-primary">
                    {item.time}
                  </span>
                </div>

                {/* TIMELINE DOT */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center group-hover:bg-primary transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-primary-foreground" />
                </div>

                {/* CONTENT CARD */}
                <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card hover:bg-card/90 hover:border-primary/50 transition-all shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="font-bold font-display text-lg text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    {/* MOBILE TIME */}
                    <span className="sm:hidden text-xs font-mono font-semibold text-primary">
                      ⏱ {item.time}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-2 border-t border-border/50 flex flex-wrap gap-2">
                    {item.points.map((pt) => (
                      <span
                        key={pt}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60 text-[11px] font-medium text-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
