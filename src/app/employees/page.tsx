import React from 'react';
import Link from 'next/link';

export default function EmployeesPage() {
  // Minimal static list until API wired
  const employees = [
    {id:1, name:'Alice'},
    {id:2, name:'Bob'},
  ];

  return (
    <main style={{padding:20}}>
      <h1>Employees</h1>
      <Link href="/wizard">Open Wizard</Link>
      <ul>
        {employees.map(e => <li key={e.id}>{e.name}</li>)}
      </ul>
    </main>
  );
}
