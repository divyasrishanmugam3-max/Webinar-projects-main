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
      <DialogContent className="max-w-4xl overflow-hidden rounded-2xl border-border bg-card p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Lead Details</DialogTitle>
            <DialogDescription>View, update, and follow up on the lead.</DialogDescription>
          </DialogHeader>

          {!lead ? (
            <div className="mt-6 text-sm text-muted-foreground">Loading lead details...</div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="secondary" asChild>
                  <a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp</a>
                </Button>
                <Button type="button" variant="secondary" asChild>
                  <a href={emailLink}>Email</a>
                </Button>
                <Button type="button" variant="outline" onClick={() => update({
                  lead_status: lead.lead_status,
                  attendance_status: lead.attendance_status,
                  counselling_status: lead.counselling_status,
                  contact_status: lead.contact_status || 'Not Contacted',
                  follow_up_date: lead.follow_up_date,
                  follow_up_notes: lead.follow_up_notes,
                })} disabled={saving}>Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => update({ counselling_status: 'Booked', lead_status: 'Interested' })} disabled={saving}>Book Counselling</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Personal Information</h3>
                  <div className="space-y-3 text-sm">
                    <div><Label>Full Name</Label><div className="mt-1 font-medium text-foreground">{lead.full_name || '—'}</div></div>
                    <div><Label>WhatsApp</Label><div className="mt-1 font-medium text-foreground">{lead.whatsapp_number || '—'}</div></div>
                    <div><Label>Email</Label><div className="mt-1 font-medium text-foreground">{lead.email || '—'}</div></div>
                    <div><Label>City</Label><div className="mt-1 font-medium text-foreground">{lead.city || '—'}</div></div>
                    <div><Label>Qualification</Label><div className="mt-1 font-medium text-foreground">{lead.qualification || '—'}</div></div>
                    <div><Label>Current Status</Label><div className="mt-1 font-medium text-foreground">{lead.current_status || '—'}</div></div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Course Information</h3>
                  <div className="space-y-3 text-sm">
                    <div><Label>Course Interest</Label><div className="mt-1 font-medium text-foreground">{lead.course_interest || '—'}</div></div>
                    <div><Label>Main Goal</Label><div className="mt-1 font-medium text-foreground">{lead.main_goal || '—'}</div></div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <Label>Lead Status</Label>
                  <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-foreground" value={lead.lead_status || 'Registered'} onChange={(e) => setLead({ ...lead, lead_status: e.target.value })}>
                    {LEAD_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>

                <div>
                  <Label>Attendance Status</Label>
                  <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-foreground" value={lead.attendance_status || 'Not Attended'} onChange={(e) => setLead({ ...lead, attendance_status: e.target.value })}>
                    {ATTENDANCE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>

                <div>
                  <Label>Counselling Status</Label>
                  <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-foreground" value={lead.counselling_status || 'Not Booked'} onChange={(e) => setLead({ ...lead, counselling_status: e.target.value })}>
                    {COUNSELLING_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>

                <div>
                  <Label>Contact Status</Label>
                  <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-foreground" value={lead.contact_status || 'Not Contacted'} onChange={(e) => setLead({ ...lead, contact_status: e.target.value })}>
                    {CONTACT_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Registration</h3>
                  <div className="space-y-3 text-sm">
                    <div><Label>Source</Label><div className="mt-1 font-medium text-foreground">{lead.source || '—'}</div></div>
                    <div><Label>Registration Date</Label><div className="mt-1 font-medium text-foreground">{formatDate(lead.registration_date)}</div></div>
                    <div><Label>Webinar Date</Label><div className="mt-1 font-medium text-foreground">{lead.webinar_date || '—'}</div></div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Follow-up</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <Label>Next Follow-up Date</Label>
                      <input type="date" className="mt-1 w-full rounded-md border border-input bg-background p-2 text-foreground" value={lead.follow_up_date ? String(lead.follow_up_date).slice(0, 10) : ''} onChange={(e) => setLead({ ...lead, follow_up_date: e.target.value || null })} />
                    </div>
                    <div>
                      <Label>Follow-up Notes</Label>
                      <textarea className="mt-1 w-full rounded-md border border-input bg-background p-2 text-foreground" rows={4} value={lead.follow_up_notes || ''} onChange={(e) => setLead({ ...lead, follow_up_notes: e.target.value })} />
                    </div>
                    <div>
                      <Label>Last Contacted At</Label>
                      <div className="mt-1 font-medium text-foreground">{formatDate(lead.last_contacted_at)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminLeadModal;
