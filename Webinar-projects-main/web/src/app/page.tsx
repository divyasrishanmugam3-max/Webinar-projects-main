'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WhatYouWillLearn } from '@/components/WhatYouWillLearn';
import { WhoShouldAttend } from '@/components/WhoShouldAttend';
import { WhyAttend } from '@/components/WhyAttend';
import { AgendaTimeline } from '@/components/AgendaTimeline';
import { AboutAcademy } from '@/components/AboutAcademy';
import { MentorSection } from '@/components/MentorSection';
import { FAQSection } from '@/components/FAQSection';
import { FinalCTA } from '@/components/FinalCTA';
import { RegistrationModal } from '@/components/RegistrationModal';
import { ACADEMY_PRESETS, AcademyInfo } from '@/types/webinar';

export default function Home() {
  const [currentAcademy, setCurrentAcademy] = useState<AcademyInfo>(ACADEMY_PRESETS[0]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenRegister = () => {
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* STICKY HEADER WITH ACADEMY CUSTOMIZER */}
      <Header
        currentAcademy={currentAcademy}
        onAcademyChange={(newAcademy) => setCurrentAcademy(newAcademy)}
        onRegisterClick={handleOpenRegister}
      />

      <main>
        {/* 1. HERO SECTION */}
        <Hero
          academyName={currentAcademy.name}
          tagline={currentAcademy.tagline}
          onRegisterClick={handleOpenRegister}
        />

        {/* 2. WHAT YOU WILL LEARN */}
        <WhatYouWillLearn />

        {/* 3. WHO SHOULD ATTEND */}
        <WhoShouldAttend onRegisterClick={handleOpenRegister} />

        {/* 4. WHY ATTEND? */}
        <WhyAttend />

        {/* 5. WEBINAR AGENDA TIMELINE */}
        <AgendaTimeline />

        {/* 6. ABOUT THE ACADEMY */}
        <AboutAcademy academy={currentAcademy} />

        {/* 7. WEBINAR MENTOR / SPEAKER */}
        <MentorSection />

        {/* 8. FAQ SECTION */}
        <FAQSection />

        {/* 9. FINAL CTA */}
        <FinalCTA
          academyName={currentAcademy.name}
          onRegisterClick={handleOpenRegister}
        />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-card text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-sm">{currentAcademy.logoIcon}</span>
            <span className="font-semibold text-foreground">{currentAcademy.name}</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Live Python Full Stack + AI Masterclass</span>
            <span>•</span>
            <button onClick={handleOpenRegister} className="hover:text-primary transition-colors font-medium">
              Register Free
            </button>
          </div>
        </div>
      </footer>

      {/* REGISTRATION MODAL DIALOG */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        academyName={currentAcademy.name}
      />

    </div>
  );
}
