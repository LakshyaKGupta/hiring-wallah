'use client'

import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

export default function RecruiterSettingsPage() {
  return (
    <WorkspaceShell role="recruiter" activeId="settings" title="Settings" subtitle="Recruiter workspace settings" primaryActionLabel="Jobs" onPrimaryAction={() => { window.location.href = '/recruiter/jobs' }} action={null} onCloseAction={() => undefined}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Settings</h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          Role switching is intentionally not part of the MVP. Recruiter remains recruiter. Company profile editing can be added after the core job, resume, evaluation, and report workflow works end to end.
        </p>
      </section>
    </WorkspaceShell>
  )
}
