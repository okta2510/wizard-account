'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BasicInfo, Details, Role } from '@/lib/types';
import { addBasicInfo, addDetails } from '@/lib/storage';
import Autocomplete from '../../../components/Shared/Autocomplete';
import FileUpload from '../../../components/Shared/FileUpload';
import ProgressBar from '../../../components/Shared/ProgressBar';
import { useDraftPersistence } from '../../../hooks/useLocalDraft';

interface StepTwoProps {
  step1Data: Partial<BasicInfo>;
  role: Role;
  onBack?: () => void;
}

export default function StepTwo({ step1Data, role, onBack }: StepTwoProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Details>>({
    photo: '',
    employment_type: '',
    office_location: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useDraftPersistence(formData, setFormData, role, 2);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employment_type) {
      newErrors.employment_type = 'Employment type is required';
    }

    if (!formData.office_location) {
      newErrors.office_location = 'Office location is required';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (field: keyof Details, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: string) => {
    handleChange('office_location', location);
  };

  const handlePhotoChange = (base64: string) => {
    handleChange('photo', base64);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitProgress([]);
    setProgress(0);

    try {
      setSubmitProgress(prev => [...prev, '⏳ Submitting basicInfo...']);
      setProgress(25);

      const basicInfoData: BasicInfo = {
        employee_id: step1Data.employee_id || '',
        full_name: step1Data.full_name || '',
        email: step1Data.email || '',
        department: step1Data.department || '',
        role: step1Data.role || ''
      };

      await delay(3000);

      addBasicInfo(basicInfoData);

      setSubmitProgress(prev => [...prev, '✅ basicInfo saved!']);
      setProgress(50);

      setSubmitProgress(prev => [...prev, '⏳ Submitting details...']);
      setProgress(75);

      const detailsData: Details = {
        employee_id: step1Data.employee_id || '',
        email: step1Data.email || '',
        photo: formData.photo || '',
        employment_type: formData.employment_type || '',
        office_location: formData.office_location || '',
        notes: formData.notes || '',
        user_role: role || ''
      };

      await delay(3000);

      addDetails(detailsData);

      setSubmitProgress(prev => [...prev, '✅ details saved!']);
      setProgress(100);
      setSubmitProgress(prev => [...prev, '🎉 All data processed successfully!']);

      localStorage.removeItem(`draft_${role}_step1`);
      localStorage.removeItem(`draft_${role}_step2`);

      await delay(1000);
      router.push('/employees');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitProgress(prev => [...prev, '❌ Error submitting data']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(`draft_${role}_step2`);
    setFormData({
      photo: '',
      employment_type: '',
      office_location: '',
      notes: '',
    });
  };

  return (
    <div className="form-step">
      <h2 className="form-step-title">Details & Submit</h2>

      <div className="form-group">
        <label className="form-label">Photo</label>
        <FileUpload onFileChange={handlePhotoChange} currentPhoto={formData.photo} />
      </div>

      <div className="form-group">
        <label htmlFor="employment_type" className="form-label">
          Employment Type <span className="required">*</span>
        </label>
        <select
          id="employment_type"
          className={`form-input ${errors.employment_type ? 'error' : ''}`}
          value={formData.employment_type || ''}
          onChange={(e) => handleChange('employment_type', e.target.value)}
        >
          <option value="">Select employment type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Intern">Intern</option>
        </select>
        {errors.employment_type && <span className="form-error">{errors.employment_type}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="office_location" className="form-label">
          Office Location <span className="required">*</span>
        </label>
        <Autocomplete
          value={formData.office_location || ''}
          onSelect={handleLocationSelect}
          endpoint="locations"
          placeholder="Search locations..."
          error={errors.office_location}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Notes
        </label>
        <textarea
          id="notes"
          className="form-textarea"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
        />
      </div>

      {isSubmitting && (
        <div className="submit-progress">
          <ProgressBar progress={progress} />
          <div className="progress-logs">
            {submitProgress.map((log, index) => (
              <div key={index} className="progress-log">{log}</div>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        {onBack && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClearDraft}
          disabled={isSubmitting}
        >
          Clear Draft
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
