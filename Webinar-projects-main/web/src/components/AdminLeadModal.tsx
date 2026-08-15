"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LEAD_STATUS_OPTIONS = ['Registered', 'Confirmed', 'Attended', 'Interested', 'Counselling Booked', 'Enrolled', 'Lost', 'Not Interested'];
const ATTENDANCE_OPTIONS = ['Not Attended', 'Attended'];
const COUNSELLING_OPTIONS = ['Not Booked', 'Booked', 'Completed'];
const CONTACT_STATUS_OPTIONS = ['Not Contacted', 'Contacted', 'Follow-up Required', 'Contacted Successfully'];

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

export function AdminLeadModal({ open, onClose, id, onUpdated }: { open: boolean; onClose: () => void; id: string | null; onUpdated?: (lead:any)=>void }) {
  const [lead, setLead] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
   if (!open || !id) return;

(async () => {
  try {
    const res = await fetch(
      `https://dutxrxgwslbqlywnhrzj.supabase.co/rest/v1/leads?id=eq.${id}&select=*`,
      {
        method: 'GET',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (res.ok) {
      const data = await res.json();

      const lead = Array.isArray(data) ? data[0] : data;

      setLead(lead);
    } else {
      const error = await res.json().catch(() => ({}));
      console.error('Failed to fetch lead:', error);
    }
  } catch (error) {
    console.error('Failed to fetch lead:', error);
  }
})();
  }, [open, id]);

const update = async (patch: any) => {
  if (!id) return;

  setSaving(true);

  try {
    const res = await fetch(
      `https://dutxrxgwslbqlywnhrzj.supabase.co/rest/v1/leads?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(patch),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.message ||
        data?.details ||
        data?.hint ||
        'Update failed'
      );
    }

    const updatedLead = Array.isArray(data) ? data[0] : data;

    setLead(updatedLead);

    toast.success('Lead updated');

    if (onUpdated) {
      onUpdated(updatedLead);
    }
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Update failed'
    );
  } finally {
    setSaving(false);
  }
};

  const whatsappLink = lead?.whatsapp_number ? `https://wa.me/${String(lead.whatsapp_number).replace(/\D/g, '')}` : '#';
  const emailLink = lead?.email ? `mailto:${lead.email}` : '#';

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-gray-200 bg-white p-0 shadow-lg">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 bg-emerald-50 px-6 py-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Lead Details</DialogTitle>
            <DialogDescription className="text-gray-600">View, update, and follow up on the lead.</DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {!lead ? (
              <div className="mt-6 text-sm text-gray-500">Loading lead details...</div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button type="button" className="bg-emerald-700 text-white hover:bg-emerald-800" asChild>
                    <a href={whatsappLink} target="_blank" rel="noreferrer">Open WhatsApp</a>
                  </Button>
                  <Button type="button" className="bg-emerald-600 text-white hover:bg-emerald-700" asChild>
                    <a href={emailLink}>Send Email</a>
                  </Button>
                  <Button type="button" variant="outline" className="border-gray-300" onClick={() => update({
                    lead_status: lead.lead_status,
                    attendance_status: lead.attendance_status,
                    counselling_status: lead.counselling_status,
                    contact_status: lead.contact_status || 'Not Contacted',
                    follow_up_date: lead.follow_up_date,
                    follow_up_notes: lead.follow_up_notes,
                  })} disabled={saving}>Save Changes</Button>
                  <Button type="button" className="bg-amber-600 text-white hover:bg-amber-700" onClick={() => update({ counselling_status: 'Booked', lead_status: 'Interested' })} disabled={saving}>Book Counselling</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-900">Personal Information</h3>
                    <div className="space-y-4 text-sm">
                      <div><Label className="text-xs font-semibold text-emerald-700">Full Name</Label><div className="mt-1 font-medium text-gray-900">{lead.full_name || '—'}</div></div>
                      <div><Label className="text-xs font-semibold text-emerald-700">WhatsApp</Label><div className="mt-1 font-medium text-gray-900">{lead.whatsapp_number || '—'}</div></div>
                      <div><Label className="text-xs font-semibold text-emerald-700">Email</Label><div className="mt-1 font-medium text-gray-900">{lead.email || '—'}</div></div>
                      <div><Label className="text-xs font-semibold text-emerald-700">City</Label><div className="mt-1 font-medium text-gray-900">{lead.city || '—'}</div></div>
                      <div><Label className="text-xs font-semibold text-emerald-700">Qualification</Label><div className="mt-1 font-medium text-gray-900">{lead.qualification || '—'}</div></div>
                      <div><Label className="text-xs font-semibold text-emerald-700">Current Status</Label><div className="mt-1 font-medium text-gray-900">{lead.current_status || '—'}</div></div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-emerald-50 p-4">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-900">Course Information</h3>
                    <div className="space-y-4 text-sm">
                      <div><Label className="text-xs font-semibold text-emerald-700">Course Interest</Label><div className="mt-1 font-medium text-gray-900">{lead.course_interest || '—'}</div></div>
                      <div><Label className="text-xs font-semibold text-emerald-700">Main Goal</Label><div className="mt-1 font-medium text-gray-900">{lead.main_goal || '—'}</div></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Status & Progress</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <Label className="text-xs font-semibold text-emerald-700">Lead Status</Label>
                      <select className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500" value={lead.lead_status || 'Registered'} onChange={(e) => setLead({ ...lead, lead_status: e.target.value })}>
                        {LEAD_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-emerald-700">Attendance Status</Label>
                      <select className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500" value={lead.attendance_status || 'Not Attended'} onChange={(e) => setLead({ ...lead, attendance_status: e.target.value })}>
                        {ATTENDANCE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-emerald-700">Counselling Status</Label>
                      <select className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500" value={lead.counselling_status || 'Not Booked'} onChange={(e) => setLead({ ...lead, counselling_status: e.target.value })}>
                        {COUNSELLING_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-emerald-700">Contact Status</Label>
                      <select className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500" value={lead.contact_status || 'Not Contacted'} onChange={(e) => setLead({ ...lead, contact_status: e.target.value })}>
                        {CONTACT_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-emerald-50 p-4">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-900">Registration Info</h3>
                    <div className="space-y-4 text-sm">
                        <div><Label className="text-xs font-semibold text-emerald-700">Source</Label><div className="mt-1 font-medium text-gray-900">{lead.source || '—'}</div></div>
                        <div><Label className="text-xs font-semibold text-emerald-700">Registration Date</Label><div className="mt-1 font-medium text-gray-900">{formatDate(lead.registration_date)}</div></div>
                        <div><Label className="text-xs font-semibold text-emerald-700">Webinar Date</Label><div className="mt-1 font-medium text-gray-900">{lead.webinar_date || '—'}</div></div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-amber-50 p-4">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-900">Follow-up</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <Label className="text-xs font-semibold text-amber-700">Next Follow-up Date</Label>
                        <input type="date" className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:ring-amber-500" value={lead.follow_up_date ? String(lead.follow_up_date).slice(0, 10) : ''} onChange={(e) => setLead({ ...lead, follow_up_date: e.target.value || null })} />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-amber-700">Follow-up Notes</Label>
                        <textarea className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:ring-amber-500" rows={3} value={lead.follow_up_notes || ''} onChange={(e) => setLead({ ...lead, follow_up_notes: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-amber-700">Last Contacted At</Label>
                        <div className="mt-1 font-medium text-gray-900">{formatDate(lead.last_contacted_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
                  <Button type="button" variant="outline" className="border-gray-300" onClick={onClose}>Close</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminLeadModal;
