'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const courseOptions = [
  'Full Stack Development',
  'Python Full Stack',
  'Data Science & AI',
  'Web Development',
  'Digital Marketing',
  'UI/UX Design',
  'Career Bootcamp',
  'Other',
];

const initialForm = {
  full_name: '',
  date_of_birth: '',
  gender: '',
  mobile_number: '',
  whatsapp_number: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pin_code: '',
  highest_qualification: '',
  course_degree: '',
  institution: '',
  year_of_completion: '',
  occupation_status: '',
  course_id: '',
  course_name: '',
  training_mode: '',
  preferred_batch: '',
  preferred_class_timing: '',
  reason_for_joining: '',
  career_goal: '',
  career_goal_other: '',
  referral_source: '',
  referral_source_other: '',
  emergency_contact_name: '',
  emergency_contact_relationship: '',
  emergency_contact_number: '',
  declaration_accepted: false,
  terms_accepted: false,
};

const fieldClasses =
  'h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

function AdmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const leadId = searchParams.get('lead_id');
    if (leadId) {
      setFormData((prev) => ({ ...prev, lead_id: leadId }));
    }
  }, [searchParams]);

  const canSubmit = useMemo(() => {
    return (
      formData.full_name.trim() &&
      formData.mobile_number.trim() &&
      formData.email.trim() &&
      formData.course_name.trim() &&
      formData.training_mode.trim() &&
      formData.declaration_accepted &&
      formData.terms_accepted
    );
  }, [formData]);

  const updateField = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');

    if (!canSubmit) {
      setSubmitError('Please complete all required fields and accept the required declarations.');
      return;
    }

    const payload = {
      ...formData,
      course_name: formData.course_name || formData.course_id,
      whatsapp_number: formData.whatsapp_number || formData.mobile_number,
      lead_id: searchParams.get('lead_id') || undefined,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to submit application.');
      }

      router.push(`/admission/success?application_id=${encodeURIComponent(data.application_id)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit application.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Ilai Digital Solutions Professional Academy</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Student Admission Application</h1>
          </div>
          <Link href="/" className="inline-flex items-center rounded-full border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Back to Home
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="full_name" className="mb-2 block text-sm font-medium">Full Name *</Label>
                <Input id="full_name" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} className={fieldClasses} placeholder="Enter your full name" required />
              </div>

              <div>
                <Label htmlFor="date_of_birth" className="mb-2 block text-sm font-medium">Date of Birth</Label>
                <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={(e) => updateField('date_of_birth', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="gender" className="mb-2 block text-sm font-medium">Gender</Label>
                <select id="gender" value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} className={fieldClasses}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <Label htmlFor="mobile_number" className="mb-2 block text-sm font-medium">Mobile Number *</Label>
                <Input id="mobile_number" value={formData.mobile_number} onChange={(e) => updateField('mobile_number', e.target.value)} className={fieldClasses} placeholder="+91 98765 43210" required />
              </div>

              <div>
                <Label htmlFor="whatsapp_number" className="mb-2 block text-sm font-medium">WhatsApp Number</Label>
                <Input id="whatsapp_number" value={formData.whatsapp_number} onChange={(e) => updateField('whatsapp_number', e.target.value)} className={fieldClasses} placeholder="Optional" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email" className="mb-2 block text-sm font-medium">Email Address *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={fieldClasses} placeholder="you@example.com" required />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-2 block text-sm font-medium">Residential Address</Label>
                <textarea id="address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className={`${fieldClasses} min-h-[100px]`} placeholder="Enter your address" />
              </div>

              <div>
                <Label htmlFor="city" className="mb-2 block text-sm font-medium">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="state" className="mb-2 block text-sm font-medium">State</Label>
                <Input id="state" value={formData.state} onChange={(e) => updateField('state', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="pin_code" className="mb-2 block text-sm font-medium">PIN Code</Label>
                <Input id="pin_code" value={formData.pin_code} onChange={(e) => updateField('pin_code', e.target.value)} className={fieldClasses} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-xl font-semibold">Educational & Professional Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="highest_qualification" className="mb-2 block text-sm font-medium">Highest Educational Qualification</Label>
                <select id="highest_qualification" value={formData.highest_qualification} onChange={(e) => updateField('highest_qualification', e.target.value)} className={fieldClasses}>
                  <option value="">Select</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="course_degree" className="mb-2 block text-sm font-medium">Course / Degree</Label>
                <Input id="course_degree" value={formData.course_degree} onChange={(e) => updateField('course_degree', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="institution" className="mb-2 block text-sm font-medium">College / Institution</Label>
                <Input id="institution" value={formData.institution} onChange={(e) => updateField('institution', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="year_of_completion" className="mb-2 block text-sm font-medium">Year of Completion</Label>
                <Input id="year_of_completion" value={formData.year_of_completion} onChange={(e) => updateField('year_of_completion', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="occupation_status" className="mb-2 block text-sm font-medium">Occupation</Label>
                <select id="occupation_status" value={formData.occupation_status} onChange={(e) => updateField('occupation_status', e.target.value)} className={fieldClasses}>
                  <option value="">Select</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Business / Self-Employed">Business / Self-Employed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-xl font-semibold">Course Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="course_name" className="mb-2 block text-sm font-medium">Course Applying For *</Label>
                <select id="course_name" value={formData.course_name} onChange={(e) => updateField('course_name', e.target.value)} className={fieldClasses} required>
                  <option value="">Select a course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="training_mode" className="mb-2 block text-sm font-medium">Preferred Training Mode *</Label>
                <select id="training_mode" value={formData.training_mode} onChange={(e) => updateField('training_mode', e.target.value)} className={fieldClasses} required>
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <Label htmlFor="preferred_batch" className="mb-2 block text-sm font-medium">Preferred Batch</Label>
                <Input id="preferred_batch" value={formData.preferred_batch} onChange={(e) => updateField('preferred_batch', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="preferred_class_timing" className="mb-2 block text-sm font-medium">Preferred Class Timing</Label>
                <Input id="preferred_class_timing" value={formData.preferred_class_timing} onChange={(e) => updateField('preferred_class_timing', e.target.value)} className={fieldClasses} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-xl font-semibold">Career & Learning</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="reason_for_joining" className="mb-2 block text-sm font-medium">Why are you interested in this course?</Label>
                <textarea id="reason_for_joining" value={formData.reason_for_joining} onChange={(e) => updateField('reason_for_joining', e.target.value)} className={`${fieldClasses} min-h-[120px]`} placeholder="Tell us about your goals and motivation" />
              </div>

              <div>
                <Label htmlFor="career_goal" className="mb-2 block text-sm font-medium">Career Goal</Label>
                <select id="career_goal" value={formData.career_goal} onChange={(e) => updateField('career_goal', e.target.value)} className={fieldClasses}>
                  <option value="">Select</option>
                  <option value="Learn a new skill">Learn a new skill</option>
                  <option value="Improve existing skills">Improve existing skills</option>
                  <option value="Build projects">Build projects</option>
                  <option value="Prepare for employment">Prepare for employment</option>
                  <option value="Career development">Career development</option>
                  <option value="Start freelancing">Start freelancing</option>
                  <option value="Start a business">Start a business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="career_goal_other" className="mb-2 block text-sm font-medium">If other, specify</Label>
                <Input id="career_goal_other" value={formData.career_goal_other} onChange={(e) => updateField('career_goal_other', e.target.value)} className={fieldClasses} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-xl font-semibold">How Did You Hear About Us?</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="referral_source" className="mb-2 block text-sm font-medium">Source</Label>
                <select id="referral_source" value={formData.referral_source} onChange={(e) => updateField('referral_source', e.target.value)} className={fieldClasses}>
                  <option value="">Select</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Google Search">Google Search</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Friend / Referral">Friend / Referral</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="referral_source_other" className="mb-2 block text-sm font-medium">If other, specify</Label>
                <Input id="referral_source_other" value={formData.referral_source_other} onChange={(e) => updateField('referral_source_other', e.target.value)} className={fieldClasses} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-xl font-semibold">Emergency Contact</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="emergency_contact_name" className="mb-2 block text-sm font-medium">Emergency Contact Name</Label>
                <Input id="emergency_contact_name" value={formData.emergency_contact_name} onChange={(e) => updateField('emergency_contact_name', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="emergency_contact_relationship" className="mb-2 block text-sm font-medium">Relationship</Label>
                <Input id="emergency_contact_relationship" value={formData.emergency_contact_relationship} onChange={(e) => updateField('emergency_contact_relationship', e.target.value)} className={fieldClasses} />
              </div>

              <div>
                <Label htmlFor="emergency_contact_number" className="mb-2 block text-sm font-medium">Emergency Contact Number</Label>
                <Input id="emergency_contact_number" value={formData.emergency_contact_number} onChange={(e) => updateField('emergency_contact_number', e.target.value)} className={fieldClasses} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="mb-5 text-xl font-semibold">Declaration & Terms</h2>

            <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4 text-sm leading-6 text-muted-foreground">
              <p>
                I confirm that the information provided in this application is true, accurate, and complete to the best of my knowledge. I understand that submitting this application does not by itself constitute final enrollment in the selected course. I understand that admission and enrollment are subject to the applicable course requirements, availability, fee payment, and acceptance of the Academy&apos;s applicable Terms &amp; Conditions and Enrollment Agreement. I agree to provide accurate information and notify the Academy if any important information provided in this application changes.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.declaration_accepted}
                  onChange={(e) => updateField('declaration_accepted', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                  required
                />
                <span>I confirm that I have read and understood the above declaration.</span>
              </label>

              <label className="flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.terms_accepted}
                  onChange={(e) => updateField('terms_accepted', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                  required
                />
                <span>I agree to the Academy&apos;s Terms &amp; Conditions.</span>
              </label>
            </div>
          </section>

          {submitError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          <div className="flex flex-col justify-end gap-3 border-t border-border pt-5 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => router.push('/')} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit} className="w-full sm:w-auto">
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function AdmissionPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading admission form...</div>}>
      <AdmissionForm />
    </Suspense>
  );
}
