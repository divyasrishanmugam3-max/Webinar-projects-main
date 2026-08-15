"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Download,
  GraduationCap,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldAlert,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import AdminLeadModal from '@/components/AdminLeadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@supabase/supabase-js';

type LeadRecord = Record<string, any>;

type FilterState = {
  search: string;
  status: string;
  attendance: string;
  counselling: string;
  course: string;
  source: string;
  contact: string;
  start: string;
  end: string;
};

const EMPTY_FILTERS: FilterState = {
  search: '',
  status: '',
  attendance: '',
  counselling: '',
  course: '',
  source: '',
  contact: '',
  start: '',
  end: '',
};

const LEAD_STATUS_OPTIONS = ['Registered', 'Confirmed', 'Interested', 'Enrolled', 'Lost', 'Not Interested'];
const SOURCE_OPTIONS = ['Instagram', 'WhatsApp', 'LinkedIn', 'Website', 'Direct', 'Other'];
const CONTACT_STATUS_OPTIONS = ['Not Contacted', 'Contacted', 'Follow-up Required', 'Contacted Successfully'];

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'info' | 'danger' }) {
  const toneStyles: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${toneStyles[tone]}`}>{children}</span>;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [sourceOptions, setSourceOptions] = useState<string[]>(SOURCE_OPTIONS);

  const fetchLeads = async (currentFilters: FilterState = filters) => {
    setLoading(true);
    setError(null);

    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    console.log("anonKey===",anonKey)

    const params = new URLSearchParams();
    if (currentFilters.search) params.set('search', currentFilters.search);
    if (currentFilters.status) params.set('status', currentFilters.status);
    if (currentFilters.attendance) params.set('attendance', currentFilters.attendance);
    if (currentFilters.counselling) params.set('counselling', currentFilters.counselling);
    if (currentFilters.course) params.set('course', currentFilters.course);
    if (currentFilters.source) params.set('source', currentFilters.source);
    if (currentFilters.contact) params.set('contact', currentFilters.contact);
    if (currentFilters.start) params.set('start', currentFilters.start);
    if (currentFilters.end) params.set('end', currentFilters.end);

    try {
      const res = await fetch(
  `https://dutxrxgwslbqlywnhrzj.supabase.co/rest/v1/leads${params.toString()}`,
  {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
  }

);

const json = await res.json();
console.log("json===",json)
if (!res.ok) {
  throw new Error(
    json?.message || json?.error || 'Unable to load leads'
  );
}
      const rows = Array.isArray(json) ? json : [];
      setLeads(rows);
      setCourseOptions(Array.from(new Set<string>(rows.map((lead: any) => String(lead.course_interest || '').trim()).filter(Boolean))).sort());
      setSourceOptions(Array.from(new Set<string>([...SOURCE_OPTIONS, ...rows.map((lead: any) => String(lead.source || '').trim()).filter(Boolean)])).sort());
      setLastUpdated(new Date());
    } catch (fetchErr) {
      const message = fetchErr instanceof Error ? fetchErr.message : 'Unable to load leads';
      setError(message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeads(EMPTY_FILTERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    void fetchLeads(filters);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    void fetchLeads(EMPTY_FILTERS);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyPreset = (preset: Partial<FilterState>) => {
    const next = { ...filters, ...preset };
    setFilters(next);
    void fetchLeads(next);
  };

  const summary = useMemo(() => {
    const total = leads.length;
    const registered = leads.filter((lead) => String(lead.lead_status || '').trim() === 'Registered').length;
    const interested = leads.filter((lead) => String(lead.lead_status || '').trim() === 'Interested').length;
    const attended = leads.filter((lead) => String(lead.attendance_status || '').trim() === 'Attended').length;
    const notAttended = leads.filter((lead) => String(lead.attendance_status || '').trim() === 'Not Attended').length;
    const counsellingBooked = leads.filter((lead) => String(lead.counselling_status || '').trim() === 'Booked').length;
    const enrolled = leads.filter((lead) => String(lead.lead_status || '').trim() === 'Enrolled').length;

    return { total, registered, interested, attended, notAttended, counsellingBooked, enrolled };
  }, [leads]);

  const exportCsv = () => {
    if (!leads.length) return;

    const rows = leads.map((lead) => ({
      Name: lead.full_name || '',
      WhatsApp: lead.whatsapp_number || '',
      Email: lead.email || '',
      City: lead.city || '',
      Qualification: lead.qualification || '',
      'Current Status': lead.current_status || '',
      'Course Interest': lead.course_interest || '',
      Goal: lead.main_goal || '',
      Source: lead.source || '',
      'Registration Date': lead.registration_date || '',
      'Lead Status': lead.lead_status || '',
      Attendance: lead.attendance_status || '',
      Counselling: lead.counselling_status || '',
      'Contact Status': lead.contact_status || '',
      'Follow-up Date': lead.follow_up_date || '',
      'Follow-up Notes': lead.follow_up_notes || '',
    }));

    const headers = Object.keys(rows[0]);
    const content = [headers.join(','), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'webinar_leads.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdatedLead = (updatedLead: LeadRecord) => {
    setLeads((current) => current.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)));
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Lead management</p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">Webinar Lead Management</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total registered leads</div>
                <div className="mt-1 text-xl font-semibold text-white">{summary.total}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Last updated</div>
                <div className="mt-1 text-sm font-medium text-white">{lastUpdated ? formatDateTime(lastUpdated.toISOString()) : '—'}</div>
              </div>
              <Button variant="outline" onClick={() => void fetchLeads()} className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={exportCsv} className="bg-sky-500 text-slate-950 hover:bg-sky-400" disabled={!leads.length}>
                <Download className="mr-2 h-4 w-4" />
                Export Leads
              </Button>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          {[
            { title: 'Total Leads', value: summary.total, icon: Users, onClick: () => applyPreset({ status: '', attendance: '', counselling: '', course: '', source: '', contact: '', start: '', end: '' }), tone: 'neutral' },
            { title: 'Registered', value: summary.registered, icon: UserCheck, onClick: () => applyPreset({ status: 'Registered' }), tone: 'neutral' },
            { title: 'Interested', value: summary.interested, icon: MessageSquareText, onClick: () => applyPreset({ status: 'Interested' }), tone: 'info' },
            { title: 'Attended', value: summary.attended, icon: CheckCircle2, onClick: () => applyPreset({ attendance: 'Attended' }), tone: 'success' },
            { title: 'Not Attended', value: summary.notAttended, icon: XCircle, onClick: () => applyPreset({ attendance: 'Not Attended' }), tone: 'warning' },
            { title: 'Counselling Booked', value: summary.counsellingBooked, icon: BookOpenCheck, onClick: () => applyPreset({ counselling: 'Booked' }), tone: 'info' },
            { title: 'Enrolled', value: summary.enrolled, icon: GraduationCap, onClick: () => applyPreset({ status: 'Enrolled' }), tone: 'success' },
          ].map(({ title, value, icon: Icon, onClick, tone }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left shadow-lg shadow-slate-950/10 transition hover:border-sky-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-slate-900 p-2 text-sky-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{tone === 'success' ? 'Ready' : tone === 'warning' ? 'Pending' : 'View'}</div>
              </div>
              <div className="mt-5 text-3xl font-bold text-white">{value}</div>
              <div className="mt-2 text-sm text-slate-300">{title}</div>
            </button>
          ))}
        </section>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/10">
          <div className="mb-4 flex items-center gap-2 text-slate-200">
            <Search className="h-4 w-4 text-sky-400" />
            <span className="text-sm font-medium">Filters</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input id="search" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Name, email or WhatsApp" className="border-slate-700 bg-slate-900 text-slate-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-status">Lead Status</Label>
              <select id="lead-status" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-slate-50">
                <option value="">All</option>
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance</Label>
              <select id="attendance" value={filters.attendance} onChange={(event) => updateFilter('attendance', event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-slate-50">
                <option value="">All</option>
                <option value="Not Attended">Not Attended</option>
                <option value="Attended">Attended</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counselling">Counselling</Label>
              <select id="counselling" value={filters.counselling} onChange={(event) => updateFilter('counselling', event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-slate-50">
                <option value="">All</option>
                <option value="Not Booked">Not Booked</option>
                <option value="Booked">Booked</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <select id="source" value={filters.source} onChange={(event) => updateFilter('source', event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-slate-50">
                <option value="">All</option>
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <select id="course" value={filters.course} onChange={(event) => updateFilter('course', event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-slate-50">
                <option value="">All</option>
                {courseOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-status">Contact Status</Label>
              <select id="contact-status" value={filters.contact} onChange={(event) => updateFilter('contact', event.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-slate-50">
                <option value="">All</option>
                {CONTACT_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Date From</Label>
              <Input id="date-from" type="date" value={filters.start} onChange={(event) => updateFilter('start', event.target.value)} className="border-slate-700 bg-slate-900 text-slate-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">Date To</Label>
              <Input id="date-to" type="date" value={filters.end} onChange={(event) => updateFilter('end', event.target.value)} className="border-slate-700 bg-slate-900 text-slate-50" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={applyFilters} className="bg-sky-500 text-slate-950 hover:bg-sky-400">
              <FilterBadgeIcon />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters} className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800">
              Reset Filters
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl shadow-slate-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-200">
              <CalendarDays className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-medium">Registered Leads</span>
            </div>
            <div className="text-xs text-slate-400">{loading ? 'Loading...' : `${leads.length} lead(s)`}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1300px] w-full border-separate border-spacing-0 text-left text-sm text-slate-200">
              <thead className="sticky top-0 z-10 bg-slate-950/95">
                <tr>
                  {['#', 'Name', 'WhatsApp', 'Email', 'City', 'Qualification', 'Current Status', 'Course Interest', 'Goal', 'Source', 'Registered Date', 'Lead Status', 'Attendance', 'Counselling', 'Actions'].map((header) => (
                    <th key={header} className="border-b border-slate-800 px-3 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b border-slate-800">
                      {Array.from({ length: 15 }).map((__, cellIndex) => (
                        <td key={`${index}-${cellIndex}`} className="px-3 py-3">
                          <div className="h-5 animate-pulse rounded bg-slate-800/90" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={15} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <ShieldAlert className="h-10 w-10 text-amber-400" />
                        <div>
                          <div className="text-lg font-semibold text-white">Unable to load leads</div>
                          <div className="mt-1 text-sm text-slate-300">{error}</div>
                        </div>
                        <Button onClick={() => void fetchLeads()} className="bg-sky-500 text-slate-950 hover:bg-sky-400">Retry</Button>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <Users className="h-10 w-10 text-slate-500" />
                        <div>
                          <div className="text-lg font-semibold text-white">No leads found</div>
                          <div className="mt-1 text-sm text-slate-300">Try removing filters or registering a new webinar lead.</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, index) => {
                    const leadStatus = String(lead.lead_status || 'Registered');
                    const attendanceStatus = String(lead.attendance_status || 'Not Attended');
                    const counsellingStatus = String(lead.counselling_status || 'Not Booked');
                    const contactStatus = String(lead.contact_status || 'Not Contacted');

                    const badgeTone = {
                      Registered: 'neutral',
                      Confirmed: 'info',
                      Interested: 'info',
                      'Not Interested': 'danger',
                      Enrolled: 'success',
                      Lost: 'warning',
                      Attended: 'success',
                      'Not Attended': 'warning',
                      Booked: 'success',
                      'Not Booked': 'neutral',
                    } as const;

                    return (
                      <tr key={lead.id || index} className="border-b border-slate-800 hover:bg-slate-900/60">
                        <td className="px-3 py-3 text-slate-400">{index + 1}</td>
                        <td className="px-3 py-3 font-medium text-white">
                          <button type="button" onClick={() => { setSelectedLeadId(String(lead.id)); setModalOpen(true); }} className="truncate text-left hover:text-sky-400">
                            {lead.full_name || '—'}
                          </button>
                        </td>
                        <td className="px-3 py-3 text-slate-300" title={lead.whatsapp_number || ''}>{lead.whatsapp_number || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.email || ''}>{lead.email || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.city || ''}>{lead.city || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.qualification || ''}>{lead.qualification || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.current_status || ''}>{lead.current_status || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.course_interest || ''}>{lead.course_interest || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.main_goal || ''}>{lead.main_goal || '—'}</td>
                        <td className="px-3 py-3 text-slate-300" title={lead.source || ''}>{lead.source || '—'}</td>
                        <td className="px-3 py-3 text-slate-300">{formatDate(lead.registration_date)}</td>
                        <td className="px-3 py-3"><Badge tone={badgeTone[leadStatus as keyof typeof badgeTone] || 'neutral'}>{leadStatus}</Badge></td>
                        <td className="px-3 py-3"><Badge tone={badgeTone[attendanceStatus as keyof typeof badgeTone] || 'neutral'}>{attendanceStatus}</Badge></td>
                        <td className="px-3 py-3"><Badge tone={badgeTone[counsellingStatus as keyof typeof badgeTone] || 'neutral'}>{counsellingStatus}</Badge></td>
                        <td className="px-3 py-3">
                          <Button type="button" size="sm" onClick={() => { setSelectedLeadId(String(lead.id)); setModalOpen(true); }} className="bg-slate-800 text-slate-100 hover:bg-slate-700">
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AdminLeadModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedLeadId(null); }} id={selectedLeadId} onUpdated={handleUpdatedLead} />
    </div>
  );
}

function FilterBadgeIcon() {
  return <CalendarDays className="mr-2 h-4 w-4" />;
}
