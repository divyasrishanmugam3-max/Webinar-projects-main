'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { HelpCircle, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQS = [
  {
    id: 'faq-1',
    question: 'Is the webinar completely free to attend?',
    answer: 'Yes! The Python Full Stack + AI Career Webinar is 100% free of cost. There are no hidden charges or credit card requirements to reserve your seat.',
  },
  {
    id: 'faq-2',
    question: 'Who can attend this webinar?',
    answer: 'College students (CS, IT, Engineering & non-CS), fresh graduates looking for job placement, working professionals planning a career switch into IT, and beginners with zero prior coding experience are all welcome.',
  },
  {
    id: 'faq-3',
    question: 'Do I need prior programming knowledge or coding experience?',
    answer: 'No prior programming knowledge is required. We explain fundamental full-stack concepts from scratch in simple, jargon-free language before demonstrating advanced AI developer workflows.',
  },
  {
    id: 'faq-4',
    question: 'Will I receive a recording of the live webinar?',
    answer: 'While we highly recommend attending live to participate in the interactive Q&A and receive exclusive attendee bonus materials, a limited-time recording link will be emailed to registered attendees.',
  },
  {
    id: 'faq-5',
    question: 'How do I join the webinar on the event day?',
    answer: 'Upon registering, you will immediately receive a digital entry pass along with a calendar invite (.ics). On the day of the event, the live Zoom/Google Meet link will be sent directly to your registered email and WhatsApp.',
  },
  {
    id: 'faq-6',
    question: 'Is there a certificate of participation provided?',
    answer: 'Yes, all verified live attendees will receive an official digital Certificate of Attendance from our academy that you can share on LinkedIn and add to your resume.',
  },
];

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 md:py-24 bg-card/30 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold border-primary/30 text-primary bg-primary/10 rounded-full">
            Got Questions?
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Find quick answers to common questions about the webinar schedule, prerequisites, and digital certificate.
          </p>

          {/* SEARCH BOX */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search questions (e.g. certificate, free, recording)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background border-border focus-visible:ring-primary rounded-xl"
            />
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-border/60 rounded-xl px-4 py-1 data-[state=open]:bg-primary/5 data-[state=open]:border-primary/40 transition-all"
                >
                  <AccordionTrigger className="text-left font-display font-bold text-base text-foreground hover:text-primary transition-colors py-4">
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4 pt-1 border-t border-border/40">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground space-y-2">
              <p className="text-sm">No matching questions found for &quot;{searchTerm}&quot;.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
