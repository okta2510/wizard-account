'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StepOne from './step1/page';
import StepTwo from './step2/page';
import { Role, BasicInfo } from '../../lib/types';
import { initializeMockData } from '@/lib/storage';
import '../../styles/wizard.css';

function WizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<Role>('admin');
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Partial<BasicInfo>>({});

  useEffect(() => {
    initializeMockData();
  }, []);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin' || roleParam === 'ops') {
      setRole(roleParam);
      if (roleParam === 'ops') {
        setCurrentStep(2);
      }
    }
  }, [searchParams]);

  const handleStep1Complete = (data: Partial<BasicInfo>) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (role === 'admin' && currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    router.push(`/wizard?role=${newRole}`);
    if (newRole === 'ops') {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1 className="wizard-title">Employee Registration</h1>
        <div className="role-selector">
          <label htmlFor="role-select">Role:</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as Role)}
            className="role-select"
          >
            <option value="admin">Admin</option>
            <option value="ops">Ops</option>
          </select>
        </div>
      </div>

      {role === 'admin' && (
        <div className="wizard-steps">
          <div className={`wizard-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className="wizard-step-divider"></div>
          <div className={`wizard-step ${currentStep === 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Details</span>
          </div>
        </div>
      )}

      <div className="wizard-content">
        {currentStep === 1 && role === 'admin' && (
          <StepOne onComplete={handleStep1Complete} role={role} />
        )}
        {currentStep === 2 && (
          <StepTwo
            step1Data={step1Data}
            role={role}
            onBack={role === 'admin' ? handleBack : undefined}
          />
        )}
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WizardContent />
    </Suspense>
  );
}
