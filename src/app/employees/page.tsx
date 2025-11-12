'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Employee } from '@/lib/types';
import { getMergedEmployees, initializeMockData } from '@/lib/storage';
import '../../styles/globals.css';
import '../../styles/employees.css';


export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    initializeMockData();
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const fetchEmployees = () => {
    setIsLoading(true);
    try {
      const { employees: data, total } = getMergedEmployees(currentPage, itemsPerPage);
      setEmployees(data);
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => {
    router.push('/wizard?role=admin');
  };

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1 className="employees-title">Employee List</h1>
        <button className="btn btn-primary" onClick={handleAddEmployee}>
          + Add Employee
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading employees...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Employement Role</th>
                  <th>Location</th>
                  <th>Employment Type</th>
                  <th>User Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      {employee.photo ? (
                        <img src={employee.photo} alt={employee.full_name} className="employee-photo" />
                      ) : (
                        <div className="employee-photo-placeholder">N/A</div>
                      )}
                    </td>
                    <td>{employee.full_name || '-'}</td>
                    <td>{employee.employee_id  || '-'}</td>
                    <td>{employee.department  || '-'}</td>
                    <td>{employee.role  || '-'}</td>
                    <td>{employee.office_location || '—'}</td>
                    <td>{employee.employment_type || '—'}</td>
                    <td>{employee.user_role || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {employees.length === 0 && (
            <div className="no-results">
              No employees found. Add your first employee to get started.
            </div>
          )}
        </>
      )}
    </div>
  );
}
