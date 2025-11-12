import { useEffect, useRef } from 'react';
import { Role } from '@/lib/types';

export function useDraftPersistence<T>(
  formData: T,
  setFormData: (data: T) => void,
  role: Role,
  step: number
) {
  const timerRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${role}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
    isInitialMount.current = false;
  }, [role, step]);

  useEffect(() => {
    if (isInitialMount.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      localStorage.setItem(`draft_${role}`, JSON.stringify(formData));
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [formData, role, step]);
}
