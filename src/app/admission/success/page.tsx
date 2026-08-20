import Link from 'next/link';

export default function AdmissionSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ application_id?: string }> | { application_id?: string };
}) {
  const params = searchParams instanceof Promise ? undefined : searchParams;
  const applicationId = params?.application_id || 'IDS-APP-0000';

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-600">
          ✓
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Application Submitted Successfully</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Thank you for applying to Ilai Digital Solutions Professional Academy.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-background/60 p-4 text-left">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Application ID</p>
          <p className="mt-2 text-2xl font-bold tracking-wide text-foreground">{applicationId}</p>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Your application has been received successfully. Our Academy team will contact you regarding the next steps.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Back to Home
          </Link>
          <Link href="/admission" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent">
            Submit Another Application
          </Link>
        </div>
      </div>
    </main>
  );
}
