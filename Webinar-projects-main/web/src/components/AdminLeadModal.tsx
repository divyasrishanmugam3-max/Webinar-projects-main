"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function AdminLeadModal({ open, onClose, id, onUpdated }: { open: boolean; onClose: () => void; id: string | null; onUpdated?: (lead:any)=>void }) {
  const [lead, setLead] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !id) return;
    (async () => {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
      }
    })();
  }, [open, id]);

  const update = async (patch: any) => {
    if (!id) return;
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const data = await res.json();
      setLead(data.lead);
      toast.success('Updated');
      onUpdated && onUpdated(data.lead);
    } else {
      toast.error('Update failed');
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v)=> !v && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-border bg-card">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>View and update lead status</DialogDescription>
          </DialogHeader>

          {!lead ? <div>Loading...</div> : (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Full Name</Label><div className="font-semibold">{lead.full_name}</div></div>
                <div><Label>WhatsApp</Label><div className="font-semibold">{lead.whatsapp_number}</div></div>
                <div><Label>Email</Label><div className="font-semibold">{lead.email}</div></div>
                <div><Label>City</Label><div className="font-semibold">{lead.city}</div></div>
                <div><Label>Qualification</Label><div className="font-semibold">{lead.qualification}</div></div>
                <div><Label>Current Status</Label><div className="font-semibold">{lead.current_status}</div></div>
                <div><Label>Course Interest</Label><div className="font-semibold">{lead.course_interest}</div></div>
                <div><Label>Main Goal</Label><div className="font-semibold">{lead.main_goal}</div></div>
                <div><Label>Source</Label><div className="font-semibold">{lead.source}</div></div>
                <div><Label>Registration Date</Label><div className="font-semibold">{new Date(lead.registration_date).toLocaleString()}</div></div>
                <div><Label>Webinar Date</Label><div className="font-semibold">{lead.webinar_date}</div></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label>Lead Status</Label>
                  <select className="w-full mt-1 p-2 border rounded" value={lead.lead_status} onChange={(e)=> setLead({...lead, lead_status: e.target.value})}>
                    <option>Registered</option>
                    <option>Confirmed</option>
                    <option>Attended</option>
                    <option>Interested</option>
                    <option>Follow-up</option>
                    <option>Counselling</option>
                    <option>Enrolled</option>
                    <option>Not Interested</option>
                  </select>
                </div>

                <div>
                  <Label>Attendance Status</Label>
                  <select className="w-full mt-1 p-2 border rounded" value={lead.attendance_status} onChange={(e)=> setLead({...lead, attendance_status: e.target.value})}>
                    <option>Not Attended</option>
                    <option>Attended</option>
                  </select>
                </div>

                <div>
                  <Label>Counselling Status</Label>
                  <select className="w-full mt-1 p-2 border rounded" value={lead.counselling_status} onChange={(e)=> setLead({...lead, counselling_status: e.target.value})}>
                    <option>Not Booked</option>
                    <option>Booked</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button disabled={saving} onClick={()=> update({ lead_status: lead.lead_status, attendance_status: lead.attendance_status, counselling_status: lead.counselling_status })}>Save</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminLeadModal;
