// File: Schedules.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Schedules from '../Schedules';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

// Mock the custom hooks and modules
jest.mock('../../../hooks/useAxiosFetch');
jest.mock('../../../hooks/useAxiosSecure');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));
jest.mock('@react-pdf/renderer', () => ({
  BlobProvider: ({ children }) => children({ url: 'mock-url' }),
}));
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

const mockRequests = [
  {
    _id: '1',
    username: 'John Doe',
    type: 'normal waste',
    description: 'Test description',
    date: '2024-10-16',
    time: '10:00 AM',
    status: 'Pending',
    recyclableQuantity: '5kg',
    cashbackPrice: '$10',
    totalCost: '$20',
    createdAt: '2024-10-15T10:00:00Z',
  },
  {
    _id: '2',
    username: 'Jane Smith',
    type: 'e waste',
    description: 'Electronic waste',
    date: '2024-10-17',
    time: '2:00 PM',
    status: 'Approved',
    recyclableQuantity: '3kg',
    cashbackPrice: '$15',
    totalCost: '$25',
    createdAt: '2024-10-15T11:00:00Z',
  },
];

describe('Schedules Component', () => {
  beforeEach(() => {
    useAxiosFetch.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockRequests }),
    });
    useAxiosSecure.mockReturnValue({
      delete: jest.fn().mockResolvedValue({}),
    });
  });

  test('renders Schedules component', async () => {
    render(<Schedules />);
    expect(screen.getByText('Schedules')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('filters requests based on search query', async () => {
    render(<Schedules />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search pending requests by name or type');
    fireEvent.change(searchInput, { target: { value: 'john' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('filters requests based on type', async () => {
    render(<Schedules />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'e waste' } });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('deletes a schedule', async () => {
    const mockSwal = jest.requireMock('sweetalert2');
    mockSwal.fire.mockResolvedValueOnce({ isConfirmed: true }).mockResolvedValueOnce({});

    render(<Schedules />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockSwal.fire).toHaveBeenCalledTimes(2);
    });
  });

  test('generates Excel file', async () => {
    render(<Schedules />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const excelIcon = screen.getByRole('link', { name: '' });
    fireEvent.click(excelIcon);

    expect(jest.requireMock('xlsx').writeFile).toHaveBeenCalled();
  });

  test('renders PDF report link', async () => {
    render(<Schedules />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const pdfLink = screen.getByRole('link', { name: '' });
    expect(pdfLink).toHaveAttribute('href', 'mock-url');
  });

  test('handles empty request list', async () => {
    useAxiosFetch.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: [] }),
    });

    render(<Schedules />);
    await waitFor(() => {
      expect(screen.getByText('No schedules found.')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    useAxiosFetch.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('API Error')),
    });

    console.error = jest.fn(); // Mock console.error to avoid cluttering test output

    render(<Schedules />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});