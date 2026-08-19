export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'student' | 'fresher' | 'career_switcher' | 'beginner' | 'developer';
  registeredAt: string;
  ticketNumber: string;
}

export interface AcademyInfo {
  name: string;
  tagline: string;
  logoIcon: string;
}

export const ACADEMY_PRESETS: AcademyInfo[] = [
  {
    name: 'ApexIT Academy',
    tagline: 'Leading Premier Technology Training & Career Accelerator',
    logoIcon: '❖',
  },
  {
    name: 'ElevateTech Institute',
    tagline: 'Empowering Next-Gen Software Engineers & AI Innovators',
    logoIcon: '⚡',
  },
  {
    name: 'ByteCode Academy',
    tagline: 'Hands-on Full Stack & AI Mastery Program',
    logoIcon: '◈',
  },
];

export const WEBINAR_DETAILS = {
  title: 'Free Python Full Stack + AI Career Webinar',
  subtitle: 'Master Full Stack Development, Harness AI Coding Tools, and Navigate Your Pathway to High-Growth Tech Careers in 2026',
  dateTimeStr: 'Saturday, August , 2026 • 7:00 PM IST',
  targetTimestamp: new Date('2026-08-16T19:00:00+05:30').getTime(),
  duration: '90 Minutes',
  mode: 'Live Interactive Session (Zoom / Google Meet)',
  whatsAppGroupLink: 'https://chat.whatsapp.com/demo-python-ai-webinar',
};
