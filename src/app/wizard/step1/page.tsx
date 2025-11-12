'use client';

import { useState, useEffect } from 'react';
import { BasicInfo, Role } from '@/lib/types';
import { generateEmployeeId } from '@/lib/storage';
import Autocomplete from '../../../components/Shared/Autocomplete';
import { useDraftPersistence } from '../../../hooks/useLocalDraft';

interface StepOneProps {
  onComplete: (data: Partial<BasicInfo>) => void;
  role: Role;
}

export default function StepOne({ onComplete, role }: StepOneProps) {
  const [formData, setFormData] = useState<Partial<BasicInfo>>({
    full_name: '',
    email: '',
    department: '',
    role: '',
    employee_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useDraftPersistence(formData, setFormData, role, 1);

  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    if (formData.department) {
      const newId = generateEmployeeId(formData.department);
      setFormData(prev => ({ ...prev, employee_id: newId }));
    }
  }, [formData.department]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (field: keyof BasicInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDepartmentSelect = (department: string) => {
    handleChange('department', department);
  };

  const handleNext = () => {
    if (isValid) {
      onComplete(formData);
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(`draft_${role}`);
    setFormData({
      full_name: '',
      email: '',
      department: '',
      role: '',
      employee_id: '',
    });
  };

  return (
    <div className="form-step">
      <h2 className="form-step-title">Basic Information</h2>

      <div className="form-group">
        <label htmlFor="full_name" className="form-label">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          className={`form-input ${errors.full_name ? 'error' : ''}`}
          value={formData.full_name || ''}
          onChange={(e) => handleChange('full_name', e.target.value)}
        />
        {errors.full_name && <span className="form-error">{errors.full_name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="department" className="form-label">
          Department <span className="required">*</span>
        </label>
        <Autocomplete
          value={formData.department || ''}
          onSelect={handleDepartmentSelect}
          endpoint="departments"
          placeholder="Search departments..."
          error={errors.department}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role" className="form-label">
          Role <span className="required">*</span>
        </label>
        <select
          id="role"
          className={`form-input ${errors.role ? 'error' : ''}`}
          value={formData.role || ''}
          onChange={(e) => handleChange('role', e.target.value)}
        >
          <option value="">Select a role</option>
          <option value="Ops">Ops</option>
          <option value="Admin">Admin</option>
          <option value="Engineer">Engineer</option>
          <option value="Finance">Finance</option>
        </select>
        {errors.role && <span className="form-error">{errors.role}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="employee_id" className="form-label">
          Employee ID
        </label>
        <input
          type="text"
          id="employee_id"
          className="form-input"
          value={formData.employee_id || ''}
          disabled
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClearDraft}
        >
          Clear Draft
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}
