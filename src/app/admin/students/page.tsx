"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/students');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Unable to load students');
        setStudents(Array.isArray(data.students) ? data.students : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load students');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Students</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/leads" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Leads</Link>
            <Link href="/admin/admissions" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Admissions</Link>
            <Link href="/admin/students" className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Students</Link>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Admission ID</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Enrollment Date</th>
                  <th className="px-4 py-3 font-semibold">Course Status</th>
                  <th className="px-4 py-3 font-semibold">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No enrolled students found.</td></tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-800">{student.admission_id || '—'}</td>
                      <td className="px-4 py-3">{student.student_name || '—'}</td>
                      <td className="px-4 py-3">{student.course_name || '—'}</td>
                      <td className="px-4 py-3">{student.mobile_number || '—'}</td>
                      <td className="px-4 py-3">{student.email || '—'}</td>
                      <td className="px-4 py-3">{student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">{student.student_status || 'ACTIVE'}</td>
                      <td className="px-4 py-3">{student.payment_status || 'PENDING'}</td>
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
