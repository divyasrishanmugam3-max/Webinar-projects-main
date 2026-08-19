"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
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
  Filter,
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

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'info' | 'danger' | 'primary' }) {
  const toneStyles: Record<string, string> = {
    neutral: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-800 font-semibold',
    warning: 'bg-amber-100 text-amber-800 font-semibold',
    info: 'bg-emerald-50 text-emerald-800',
    danger: 'bg-red-100 text-red-800',
    primary: 'bg-emerald-700 text-white font-semibold',
  };

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${toneStyles[tone]}`}>{children}</span>;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto w-[96%] max-w-[1800px] px-6 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div>
                <Image src="/ilai-logo.svg" alt="Ilai Digital Solutions" width={56} height={56} className="rounded-md" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Webinar Lead Management</p>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Webinar Lead Management</h1>
                <p className="mt-1 text-sm text-gray-600">Manage, track and follow up with your webinar leads</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Total Registered</div>
                <div className="mt-1 text-2xl font-bold text-amber-600">{summary.total}</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Last Updated</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{lastUpdated ? formatDateTime(lastUpdated.toISOString()) : '—'}</div>
              </div>
              <Button variant="outline" onClick={() => void fetchLeads()} className="border-amber-300 bg-white text-amber-700 hover:bg-amber-50">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={exportCsv} className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={!leads.length}>
                <Download className="mr-2 h-4 w-4" />
                Export Leads
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-[96%] max-w-[1800px] px-6 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 xl:grid-cols-7">
          {[
            { title: 'Total Leads', value: summary.total, icon: Users, onClick: () => applyPreset({ status: '', attendance: '', counselling: '', course: '', source: '', contact: '', start: '', end: '' }), color: 'primary', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
            { title: 'Registered', value: summary.registered, icon: UserCheck, onClick: () => applyPreset({ status: 'Registered' }), color: 'neutral', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
            { title: 'Interested', value: summary.interested, icon: MessageSquareText, onClick: () => applyPreset({ status: 'Interested' }), color: 'info', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
            { title: 'Attended', value: summary.attended, icon: CheckCircle2, onClick: () => applyPreset({ attendance: 'Attended' }), color: 'success', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
            { title: 'Not Attended', value: summary.notAttended, icon: XCircle, onClick: () => applyPreset({ attendance: 'Not Attended' }), color: 'warning', bg: 'bg-white', iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
            { title: 'Counselling Booked', value: summary.counsellingBooked, icon: BookOpenCheck, onClick: () => applyPreset({ counselling: 'Booked' }), color: 'info', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
            { title: 'Enrolled', value: summary.enrolled, icon: GraduationCap, onClick: () => applyPreset({ status: 'Enrolled' }), color: 'success', bg: 'bg-white', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
          ].map(({ title, value, icon: Icon, onClick, bg, iconBg, iconColor }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className={`group rounded-xl border border-gray-200 ${bg} p-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg ${iconBg} p-2`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-amber-600">{value}</div>
              <div className="mt-1 text-sm font-medium text-emerald-800">{title}</div>
            </button>
          ))}
        </section>

        {/* Filter Section */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search</Label>
              <Input 
                id="search" 
                value={filters.search} 
                onChange={(event) => updateFilter('search', event.target.value)} 
                placeholder="Name, email or WhatsApp" 
                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-status" className="text-sm font-medium text-gray-700">Lead Status</Label>
              <select 
                id="lead-status" 
                value={filters.status} 
                onChange={(event) => updateFilter('status', event.target.value)} 
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">All</option>
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance" className="text-sm font-medium text-gray-700">Attendance</Label>
              <select 
                id="attendance" 
                value={filters.attendance} 
                onChange={(event) => updateFilter('attendance', event.target.value)} 
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">All</option>
                <option value="Not Attended">Not Attended</option>
                <option value="Attended">Attended</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counselling" className="text-sm font-medium text-gray-700">Counselling</Label>
              <select 
                id="counselling" 
                value={filters.counselling} 
                onChange={(event) => updateFilter('counselling', event.target.value)} 
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">All</option>
                <option value="Not Booked">Not Booked</option>
                <option value="Booked">Booked</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium text-gray-700">Source</Label>
              <select 
                id="source" 
                value={filters.source} 
                onChange={(event) => updateFilter('source', event.target.value)} 
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">All</option>
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-sm font-medium text-gray-700">Course</Label>
              <select 
                id="course" 
                value={filters.course} 
                onChange={(event) => updateFilter('course', event.target.value)} 
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">All</option>
                {courseOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-status" className="text-sm font-medium text-gray-700">Contact Status</Label>
              <select 
                id="contact-status" 
                value={filters.contact} 
                onChange={(event) => updateFilter('contact', event.target.value)} 
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">All</option>
                {CONTACT_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from" className="text-sm font-medium text-gray-700">Date From</Label>
              <Input 
                id="date-from" 
                type="date" 
                value={filters.start} 
                onChange={(event) => updateFilter('start', event.target.value)} 
                className="border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to" className="text-sm font-medium text-gray-700">Date To</Label>
              <Input 
                id="date-to" 
                type="date" 
                value={filters.end} 
                onChange={(event) => updateFilter('end', event.target.value)} 
                className="border-gray-300 bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={applyFilters} className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters} className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Reset Filters
            </Button>
          </div>
        </section>

        {/* Lead Table Section */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-700" />
              <span className="text-lg font-semibold text-gray-900">Registered Leads</span>
            </div>
            <div className="text-sm text-gray-600">{loading ? 'Loading...' : `${leads.length} lead(s)`}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-700">
              <thead className="sticky top-0 bg-emerald-50">
                <tr>
                  {['#', 'Name', 'WhatsApp', 'Email', 'City', 'Qualification', 'Current Status', 'Course Interest', 'Goal', 'Source', 'Registered Date', 'Lead Status', 'Attendance', 'Counselling', 'Actions'].map((header) => (
                    <th key={header} className="border-b border-gray-200 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-emerald-900">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="hover:bg-gray-50">
                      {Array.from({ length: 15 }).map((__, cellIndex) => (
                        <td key={`${index}-${cellIndex}`} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={15} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <ShieldAlert className="h-10 w-10 text-amber-500" />
                        <div>
                          <div className="text-lg font-semibold text-gray-900">Unable to load leads</div>
                          <div className="mt-1 text-sm text-gray-600">{error}</div>
                        </div>
                        <Button onClick={() => void fetchLeads()} className="bg-emerald-700 text-white hover:bg-emerald-800">Retry</Button>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <Users className="h-10 w-10 text-gray-400" />
                        <div>
                          <div className="text-lg font-semibold text-gray-900">No leads found</div>
                          <div className="mt-1 text-sm text-gray-600">Try removing filters or registering a new webinar lead.</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, index) => {
                    const leadStatus = String(lead.lead_status || 'Registered');
                    const attendanceStatus = String(lead.attendance_status || 'Not Attended');
                    const counsellingStatus = String(lead.counselling_status || 'Not Booked');

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
                      <tr key={lead.id || index} className="hover:bg-emerald-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <button 
                            type="button" 
                            onClick={() => { setSelectedLeadId(String(lead.id)); setModalOpen(true); }} 
                            className="truncate text-left hover:text-emerald-700 hover:underline"
                          >
                            {lead.full_name || '—'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-gray-700" title={lead.whatsapp_number || ''}>{lead.whatsapp_number || '—'}</td>
                        <td className="px-6 py-4 text-gray-700 truncate max-w-xs" title={lead.email || ''}>{lead.email || '—'}</td>
                        <td className="px-6 py-4 text-gray-700" title={lead.city || ''}>{lead.city || '—'}</td>
                        <td className="px-6 py-4 text-gray-700" title={lead.qualification || ''}>{lead.qualification || '—'}</td>
                        <td className="px-6 py-4 text-gray-700" title={lead.current_status || ''}>{lead.current_status || '—'}</td>
                        <td className="px-6 py-4 text-gray-700" title={lead.course_interest || ''}>{lead.course_interest || '—'}</td>
                        <td className="px-6 py-4 text-gray-700" title={lead.main_goal || ''}>{lead.main_goal || '—'}</td>
                        <td className="px-6 py-4 text-gray-700" title={lead.source || ''}>{lead.source || '—'}</td>
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{formatDate(lead.registration_date)}</td>
                        <td className="px-6 py-4"><Badge tone={badgeTone[leadStatus as keyof typeof badgeTone] || 'neutral'}>{leadStatus}</Badge></td>
                        <td className="px-6 py-4"><Badge tone={badgeTone[attendanceStatus as keyof typeof badgeTone] || 'neutral'}>{attendanceStatus}</Badge></td>
                        <td className="px-6 py-4"><Badge tone={badgeTone[counsellingStatus as keyof typeof badgeTone] || 'neutral'}>{counsellingStatus}</Badge></td>
                        <td className="px-6 py-4">
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => { setSelectedLeadId(String(lead.id)); setModalOpen(true); }} 
                            className="bg-emerald-700 text-white hover:bg-emerald-800"
                          >
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
      </main>

      <AdminLeadModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedLeadId(null); }} id={selectedLeadId} onUpdated={handleUpdatedLead} />
    </div>
  );
}

function FilterBadgeIcon() {
  return <CalendarDays className="mr-2 h-4 w-4" />;
}
