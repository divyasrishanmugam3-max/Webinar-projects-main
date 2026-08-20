"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ADMISSION_STATUS_OPTIONS = [
  'NEW',
  'CONTACTED',
  'COUNSELLING',
  'INTERESTED',
  'ADMISSION_APPROVED',
  'PAYMENT_PENDING',
  'PAYMENT_RECEIVED',
  'AGREEMENT_PENDING',
  'ENROLLED',
  'REJECTED',
  'WITHDRAWN',
];

type Admission = Record<string, any>;

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAdmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (course) params.set('course', course);
      if (startDate) params.set('start', startDate);
      if (endDate) params.set('end', endDate);

      const res = await fetch(`/api/admin/admissions?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Unable to load admissions');
      }

      setAdmissions(Array.isArray(data.admissions) ? data.admissions : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admissions');
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAdmissions();
  }, []);

  const courseOptions = useMemo(() => {
    return Array.from(new Set(admissions.map((row) => String(row.course_name || '').trim()).filter(Boolean))).sort();
  }, [admissions]);

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setCourse('');
    setStartDate('');
    setEndDate('');
    setTimeout(() => {
      void fetchAdmissions();
    }, 0);
  };

  const handleSearch = () => {
    void fetchAdmissions();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Admissions</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/leads" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Leads</Link>
            <Link href="/admin/admissions" className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Admissions</Link>
            <Link href="/admin/students" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Students</Link>
            <Link href="/admin/certificates" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Certificates</Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, Application ID, Mobile, Email" />
            </div>
            <div>
              <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">Status</Label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                <option value="">All</option>
                {ADMISSION_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">Course</Label>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                <option value="">All</option>
                {courseOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="w-full bg-emerald-600 hover:bg-emerald-700">Search</Button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">From Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">To Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilters} className="w-full">Reset</Button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Application ID</th>
                  <th className="px-4 py-3 font-semibold">Admission ID</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Mobile</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">Loading admissions...</td>
                  </tr>
                ) : admissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">No admissions found.</td>
                  </tr>
                ) : (
                  admissions.map((admission) => (
                    <tr key={admission.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-800">{admission.application_id || '—'}</td>
                      <td className="px-4 py-3">{admission.admission_id || '—'}</td>
                      <td className="px-4 py-3">{admission.full_name || '—'}</td>
                      <td className="px-4 py-3">{admission.course_name || '—'}</td>
                      <td className="px-4 py-3">{admission.mobile_number || '—'}</td>
                      <td className="px-4 py-3">{admission.email || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          {admission.status || 'NEW'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{admission.created_at ? new Date(admission.created_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/admissions/${admission.id}`} className="text-emerald-700 hover:underline font-medium">View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
