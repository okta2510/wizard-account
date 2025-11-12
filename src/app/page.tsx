"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(() => {
    try {
      if (typeof window === 'undefined') return 'admin';
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      return roleParam === 'admin' || roleParam === 'ops' ? roleParam : 'admin';
    } catch {
      return 'admin';
    }
  });

  const navigateToWizard = () => {
    if (role === 'admin') {
      router.push('/wizard/step1');
    } else {
      router.push('/wizard/step2');
    }
  };

  return (
    <div className="home-page" style={{padding:20}}>
      <h1>Welcome to the Employee Wizard</h1>
      <p>
        Select a role to begin the employee form:
        <br />
        <button onClick={() => setRole('admin')}>Admin</button>
        <button onClick={() => setRole('ops')}>Ops</button>
      </p>
      <button onClick={navigateToWizard}>Start Wizard</button>
    </div>
  );
};

export default HomePage;
