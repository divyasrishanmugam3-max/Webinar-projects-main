import React from 'react';
import { siteConfig } from '@/config/site';
import { WEBINAR_DETAILS } from '@/types/webinar';

function formatForCalendar(ts: number, durationMinutes = 90) {
  const start = new Date(ts);
  const end = new Date(ts + durationMinutes * 60 * 1000);
  const toCal = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '');
  return { start: toCal(start), end: toCal(end) };
}

export default function ThankYouPage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const name = searchParams?.name || '';
  const id = searchParams?.id || '';

  const phoneRaw = siteConfig.academyWhatsApp || '+911234567890';
  const phone = phoneRaw.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Hi, I have registered for the Free Webinar at Ilai Digital Solutions Professional Academy. My name is ${name}. Please add me to the webinar updates.`
  );
  const waLink = `https://wa.me/${phone}?text=${waText}`;

  const cal = formatForCalendar(WEBINAR_DETAILS.targetTimestamp, 90);
  const calText = encodeURIComponent(`${WEBINAR_DETAILS.title} - ${WEBINAR_DETAILS.subtitle}`);
  const calDetails = encodeURIComponent(`Join the live webinar: ${WEBINAR_DETAILS.mode}\n\nSee you there.`);
  const calUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${calText}&dates=${cal.start}/${cal.end}&details=${calDetails}&location=${encodeURIComponent(WEBINAR_DETAILS.mode)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-3xl w-full bg-card rounded-2xl p-8 shadow-lg text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4 mx-auto">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 className="text-2xl font-bold">🎉 You're Registered!</h1>
        <p className="text-muted-foreground mt-2">Your seat for the free webinar has been successfully reserved.</p>

        <div className="mt-6 space-y-2 text-left">
          <div className="font-semibold">{WEBINAR_DETAILS.title}</div>
          <div className="text-sm text-muted-foreground">{WEBINAR_DETAILS.dateTimeStr} • {WEBINAR_DETAILS.duration} • {WEBINAR_DETAILS.mode}</div>
          <div className="text-xs text-muted-foreground mt-2">A joining link and reminders will be sent via WhatsApp and Email.</div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#25D366] text-white font-semibold">
            Join WhatsApp Community
          </a>
          <a href={calUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-border">
            Add to Google Calendar
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-4">Join our WhatsApp community to receive webinar reminders and the webinar joining link.</p>
      </div>
    </div>
  );
}
