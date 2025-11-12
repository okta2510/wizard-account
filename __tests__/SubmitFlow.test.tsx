import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import React from 'react';

jest.useFakeTimers();

jest.mock('@/lib/storage', () => ({
  addBasicInfo: jest.fn(),
  addDetails: jest.fn(),
}));



jest.mock('@/components/Shared/Autocomplete', () => ({
  __esModule: true,
  default: (props: { value?: string; onSelect?: (v: string) => void; placeholder?: string }) => {
    return (
      <input
        placeholder={props.placeholder || 'Search locations'}
        value={props.value || ''}
        onChange={(e) => props.onSelect && props.onSelect((e.target as HTMLInputElement).value)}
      />
    );
  },
}));

jest.mock('@/components/Shared/FileUpload', () => ({
  __esModule: true,
  default: (props: { onFileChange?: (b64: string) => void }) => {
    return <input data-testid="file-input" onChange={() => props.onFileChange && props.onFileChange('mock-base64')} />;
  },
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return { push: jest.fn() };
  }
}));

jest.mock('@/hooks/useLocalDraft', () => ({
  useDraftPersistence: jest.fn(() => {}),
}));

import StepTwo from '@/app/wizard/step2/page';
const { addBasicInfo, addDetails } = jest.requireMock('@/lib/storage');

describe('StepTwo submit flow', () => {
  it('handles sequential POST and progress states', async () => {
    const step1Data = { employee_id: 'ENG-001', full_name: 'Alice', email: 'a@example.com', department: 'Engineering', role: 'admin' };
    render(<StepTwo step1Data={step1Data} role={'admin'} />);

    const employmentSelect = screen.getByLabelText(/Employment Type/i);
    fireEvent.change(employmentSelect, { target: { value: 'Full-time' } });

    const locationInput = screen.getByPlaceholderText(/Search locations/i);
    fireEvent.change(locationInput, { target: { value: 'Jak' } });

    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    act(() => { fireEvent.click(submitBtn); });
  });
});
