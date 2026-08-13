"use client";

import React, { useEffect, useMemo, useState } from 'react';
import AdminLeadModal from '@/components/AdminLeadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COURSES = [
  'Full Stack Development + AI',
  'Python Full Stack + AI',
  'Data Analytics + AI',
  'UI/UX Design + AI',
  'Not Sure',
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [attendance, setAttendance] = useState('');
  const [course, setCourse] = useState('');
  const [source, setSource] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (attendance) params.set('attendance', attendance);
    if (course) params.set('course', course);
    if (source) params.set('source', source);
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const res = await fetch('/api/admin/leads?' + params.toString());
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
    } else {
      setLeads([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const refresh = () => fetchLeads();

  const openLead = (id: string) => { setSelected(id); setModalOpen(true); };

  const onUpdated = (lead: any) => {
    setLeads((ls)=> ls.map(l=> l.id===lead.id?lead:l));
  };

  const exportCSV = () => {
    const rows = leads.map(l=> ({
      Name: l.full_name,
      WhatsApp: l.whatsapp_number,
      Email: l.email,
      City: l.city,
      Qualification: l.qualification,
      CurrentStatus: l.current_status,
      CourseInterest: l.course_interest,
      MainGoal: l.main_goal,
      Source: l.source,
      RegistrationDate: l.registration_date,
      LeadStatus: l.lead_status,
      AttendanceStatus: l.attendance_status,
      CounsellingStatus: l.counselling_status,
    }));
    const csv = [Object.keys(rows[0]||{}).join(','), ...rows.map(r=> Object.values(r).map(v=> `"${String(v||'').replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const summary = useMemo(()=>{
    const total = leads.length;
    const counts = (key:string, value:any)=> leads.filter(l=> l[key]===value).length;
    return {
      total,
      confirmed: counts('lead_status','Confirmed'),
      attended: counts('attendance_status','Attended'),
      not_attended: counts('attendance_status','Not Attended'),
      interested: counts('lead_status','Interested'),
      counselling_booked: counts('counselling_status','Booked'),
      enrolled: counts('lead_status','Enrolled'),
    };
  }, [leads]);

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin — Leads</h1>
          <div className="flex items-center gap-2">
            <Button onClick={refresh}>Refresh</Button>
            <Button onClick={exportCSV}>Export Leads</Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="p-4 bg-card rounded-lg shadow">Total<br/><div className="text-xl font-bold">{summary.total}</div></div>
          <div className="p-4 bg-card rounded-lg shadow">Confirmed<br/><div className="text-xl font-bold">{summary.confirmed}</div></div>
          <div className="p-4 bg-card rounded-lg shadow">Attended<br/><div className="text-xl font-bold">{summary.attended}</div></div>
          <div className="p-4 bg-card rounded-lg shadow">Did Not Attend<br/><div className="text-xl font-bold">{summary.not_attended}</div></div>
          <div className="p-4 bg-card rounded-lg shadow">Interested<br/><div className="text-xl font-bold">{summary.interested}</div></div>
          <div className="p-4 bg-card rounded-lg shadow">Counselling Booked<br/><div className="text-xl font-bold">{summary.counselling_booked}</div></div>
          <div className="p-4 bg-card rounded-lg shadow">Enrolled<br/><div className="text-xl font-bold">{summary.enrolled}</div></div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-card rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div><Label>Search</Label><Input value={search} onChange={(e)=> setSearch(e.target.value)} placeholder="Name, Email or WhatsApp" /></div>
            <div>
              <Label>Lead Status</Label>
              <select value={status} onChange={(e)=> setStatus(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All</option>
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
              <Label>Attendance</Label>
              <select value={attendance} onChange={(e)=> setAttendance(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All</option>
                <option>Not Attended</option>
                <option>Attended</option>
              </select>
            </div>
            <div>
              <Label>Course</Label>
              <select value={course} onChange={(e)=> setCourse(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All</option>
                {COURSES.map(c=> <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Source</Label>
              <select value={source} onChange={(e)=> setSource(e.target.value)} className="w-full p-2 border rounded">
                <option value="">All</option>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>WhatsApp</option>
                <option>YouTube</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Direct</option>
              </select>
            </div>
            <div>
              <Label>Date From</Label>
              <Input type="date" value={start} onChange={(e)=> setStart(e.target.value)} />
              <Label className="mt-2">Date To</Label>
              <Input type="date" value={end} onChange={(e)=> setEnd(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button onClick={fetchLeads}>Apply</Button>
            <Button onClick={()=> { setSearch(''); setStatus(''); setAttendance(''); setCourse(''); setSource(''); setStart(''); setEnd(''); setTimeout(fetchLeads,0); }}>Reset</Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="p-2">Name</th>
                <th>WhatsApp</th>
                <th>Email</th>
                <th>City</th>
                <th>Qualification</th>
                <th>Current Status</th>
                <th>Course Interest</th>
                <th>Goal</th>
                <th>Source</th>
                <th>Registered</th>
                <th>Lead Status</th>
                <th>Attendance</th>
                <th>Counselling</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={14}>Loading...</td></tr> : (
                leads.map(l => (
                  <tr key={l.id} className="border-t">
                    <td className="p-2">{l.full_name}</td>
                    <td>{l.whatsapp_number}</td>
                    <td>{l.email}</td>
                    <td>{l.city}</td>
                    <td>{l.qualification}</td>
                    <td>{l.current_status}</td>
                    <td>{l.course_interest}</td>
                    <td>{l.main_goal}</td>
                    <td>{l.source}</td>
                    <td>{new Date(l.registration_date).toLocaleString()}</td>
                    <td>{l.lead_status}</td>
                    <td>{l.attendance_status}</td>
                    <td>{l.counselling_status}</td>
                    <td><Button size="sm" onClick={()=> openLead(l.id)}>View / Edit</Button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminLeadModal open={modalOpen} onClose={()=> setModalOpen(false)} id={selected} onUpdated={onUpdated} />
    </div>
  );
}
