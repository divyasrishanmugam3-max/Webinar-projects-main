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
  title: 'How to Start Your Career in 2026',
  subtitle: '',
  dateTimeStr: 'Saturday, August 22, 2026 • 4:00 PM IST',
  targetTimestamp: new Date('2026-08-16T19:00:00+05:30').getTime(),
  duration: '40 Minutes',
  mode: 'Live Interactive Session (Zoom)',
  whatsAppGroupLink: 'https://chat.whatsapp.com/demo-python-ai-webinar',
};
