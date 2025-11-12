/** @jest-environment jsdom */
/* global jest describe it expect */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/lib/storage', () => ({
  getDepartments: jest.fn(() => Promise.resolve([{ id: 1, name: 'Engineering' }, { id: 2, name: 'Operations' }])),
  getLocations: jest.fn(() => Promise.resolve([{ id: 1, name: 'Jakarta' }])),
}));

import Autocomplete from '@/components/Shared/Autocomplete';
import { getDepartments } from '@/lib/storage';

describe('Autocomplete', () => {
  it('renders and fetches suggestions correctly for departments', async () => {
    const onSelect = jest.fn();
    render(
      <Autocomplete
        value=""
        onSelect={onSelect}
        endpoint="departments"
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Eng' } });

    // Wait for the mocked suggestions to appear
    await waitFor(() => expect((getDepartments as jest.Mock).mock.calls.length).toBeGreaterThan(0));
    expect(await screen.findByText('Engineering')).toBeInTheDocument();

    // select suggestion
    fireEvent.click(screen.getByText('Engineering'));
    expect(onSelect).toHaveBeenCalledWith('Engineering');
  });
});
