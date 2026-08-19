'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Laptop2,
  Sparkles,
  Users,
} from 'lucide-react';
import { RegistrationModal } from '@/components/RegistrationModal';

const audience = [
  'College Students',
  'Freshers',
  'Job Seekers',
  'Non-IT Students',
  'Anyone Planning an IT Career',
];

const learningPoints = [
  'IT Career Paths in 2026',
  'In-Demand Skills & Technologies',
  'AI & Prompt Engineering',
  'Skills vs Certificates vs Projects',
  'Building Your Portfolio',
  'Roadmap to Becoming Job-Ready',
];

const eventDate = new Date('2026-08-22T16:00:00+05:30');

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const diff = eventDate.getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#0d1714] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(27,120,94,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(215,169,83,0.12),_transparent_32%)]" />
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute right-10 top-1/3 h-48 w-48 rounded-full bg-yellow-400/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full rounded-[30px] border border-emerald-500/20 bg-[#101a17]/90 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-8 lg:p-10">
            <header className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center">
                <Image
                  src="/Logo.jpeg"
                  alt="ILAI Professional Academy logo"
                  width={520}
                  height={190}
                  priority
                  className="h-16 w-auto max-w-[300px] md:h-20 lg:h-24"
                />
              </div>

              <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-200 md:block">
                Free IT Career Webinar
              </div>
            </header>

            <div className="flex flex-col items-center gap-4 pb-2 pt-1">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="inline-flex animate-[pulse_2.1s_ease-in-out_infinite] items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 px-7 py-3.5 text-base font-black tracking-wide text-[#071210] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_40px_rgba(16,185,129,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Register Now
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100">
                100% Free
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                Skills • Roadmap • Opportunities
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/90">
                  ILAI PROFESSIONAL ACADEMY
                </p>
                <h1 className="max-w-3xl text-2xl font-semibold font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-2xl lg:text-[2.4rem]">
                  How to Start Your IT Career in 2026
                </h1>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Discover the right IT career path, essential skills, practical learning strategies,
                and opportunities to become job-ready in 2026.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Date
                </div>
                <div className="text-sm font-bold text-white">August 22, 2026</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
                  <Clock3 className="h-3.5 w-3.5" />
                  Time
                </div>
                <div className="text-sm font-bold text-white">4:00 PM IST</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
                  <Laptop2 className="h-3.5 w-3.5" />
                  Format
                </div>
                <div className="text-sm font-bold text-white">Live Online Webinar</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start">
              <div className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100">
                100% Free
              </div>
            </div>

            <div className="grid gap-5 pt-2 md:grid-cols-2">
              <div className="rounded-[24px] border border-emerald-500/20 bg-[#0f1c19] p-5">
                <h2 className="mb-4 text-lg font-bold text-white">Who Is This For?</h2>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  {audience.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] border border-amber-400/20 bg-[#171712] p-5">
                <h2 className="mb-4 text-lg font-bold text-white">What You&apos;ll Learn</h2>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  {learningPoints.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[26px] border border-emerald-500/25 bg-[#101c18] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-200/90">
                  Countdown to Webinar
                </p>

                <div className="mt-5 grid grid-cols-4 gap-2.5 text-center">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="rounded-2xl border border-white/10 bg-[#0b1412] p-3">
                      <div className="text-2xl font-black tracking-[-0.06em] text-amber-200">
                        {String(value).padStart(2, '0')}
                      </div>
                      <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {unit === 'days' ? 'Days' : unit === 'hours' ? 'Hours' : unit === 'minutes' ? 'Mins' : 'Secs'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-[#121714] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/90">
                  Event Details
                </p>

                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <span>August 22, 2026</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-200">
                      <Clock3 className="h-4 w-4" />
                    </span>
                    <span>4:00 PM IST</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                      <Laptop2 className="h-4 w-4" />
                    </span>
                    <span>Live Online Webinar</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-200">
                      <Users className="h-4 w-4" />
                    </span>
                    <span>100% Free</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-[26px] border border-amber-400/20 bg-gradient-to-br from-amber-400/6 to-emerald-500/5 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
                  <Sparkles className="h-4 w-4" />
                  Career Growth
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
                  Build a clear roadmap for tech roles, AI-driven workflows, and job-ready skills that
                  match the real opportunities of 2026.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <RegistrationModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} academyName="ILAI Professional Academy" />
    </>
  );
}
