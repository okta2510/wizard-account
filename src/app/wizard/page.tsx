"use client";
import React from 'react';
import Link from 'next/link';
import Step1 from './step1/page';
import Step2 from './step2/page';

// Simple mock to get current user role. Replace with real auth.
type Role = 'admin' | 'ops' | 'guest' | string;
const getCurrentUserRole = (): Role => {
  // In real app this should come from auth/session
  if (typeof window === 'undefined') return 'guest';
  const win = window as unknown as { APP_ROLE?: string };
  return win.APP_ROLE ?? 'guest';
};

export default function WizardPage() {
  const role = getCurrentUserRole();

  return (
    <main style={{padding:20}}>
      <h1>Employee Wizard</h1>
      <p>Current role: <strong>{role}</strong></p>
      <nav>
        <Link href="/wizard/step1">Step 1 (Admin)</Link>
        {' | '}
        <Link href="/wizard/step2">Step 2 (Admin + Ops)</Link>
      </nav>

      <section style={{marginTop:20}}>
        {role === 'admin' && <Step1 />}
        {(role === 'admin' || role === 'ops') && <Step2 />}
        {role !== 'admin' && role !== 'ops' && (
          <div>Please sign in as <em>admin</em> or <em>ops</em> to use the wizard.</div>
        )}
      </section>
    </main>
  );
}
