import { BasicInfo, Details, Employee, Departments } from './types';

const STORAGE_KEYS = {
  BASIC_INFO: 'employees_basic_info',
  DETAILS: 'employees_details',
  DEPARTMENTS: 'departments',
  LOCATIONS: 'locations',
};

export function initializeMockData() {
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify([
      { id: 1, name: 'Lending' },
      { id: 2, name: 'Funding' },
      { id: 3, name: 'Operations' },
      { id: 4, name: 'Engineering' },
    ]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify([
      { id: 1, name: 'Jakarta' },
      { id: 2, name: 'Depok' },
      { id: 3, name: 'Surabaya' },
    ]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BASIC_INFO)) {
    localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.DETAILS)) {
    localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify([]));
  }
}

// export function getDepartments(search?: string) {
//   const departments = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
//   if (!search) return departments;
//   return departments.filter((dept: any) =>
//     dept.name.toLowerCase().includes(search.toLowerCase())
//   );
// }

export async function getDepartments(search?: string): Promise<Departments[]> {
  try {
    const base = (process.env as any).API_DEPARTMENT || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/departments`);
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch departments: ${res.status}`);
    const departments = await res.json();
    if (Array.isArray(departments)) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
    }
    return departments;
  } catch (err) {
    const departments = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
    if (!search) return departments;
    return departments.filter((dept: any) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
  }
}

// export function getLocations(search?: string) {
//   const locations = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCATIONS) || '[]');
//   if (!search) return locations;
//   return locations.filter((loc: any) =>
//     loc.name.toLowerCase().includes(search.toLowerCase())
//   );
// }

export async function getLocations(search?: string): Promise<Departments[]> {
  try {
    const base = (process.env as any).API_LOCATIONS || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/locations`);
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch departments: ${res.status}`);
    const locations = await res.json();
    if (Array.isArray(locations)) {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
    }
    return locations;
  } catch (err) {
    const locations = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCATIONS) || '[]');
    if (!search) return locations;
    return locations.filter((dept: any) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
  }
}

export function generateEmployeeId(department: string): string {
  const basicInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.BASIC_INFO) || '[]') as BasicInfo[];
  const deptPrefix = department.substring(0, 3).toUpperCase();
  const count = basicInfo.filter(emp => emp.employee_id.startsWith(deptPrefix)).length;
  const nextNumber = (count + 1).toString().padStart(3, '0');
  return `${deptPrefix}-${nextNumber}`;
}

export function addBasicInfo(data: BasicInfo): BasicInfo {
  const basicInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.BASIC_INFO) || '[]') as BasicInfo[];
  const newData = {
    ...data,
    id: Date.now(),
  };
  basicInfo.push(newData);
  localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify(basicInfo));
  return newData;
}

export function addDetails(data: Details): Details {
  const details = JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILS) || '[]') as Details[];
  const newData = {
    ...data,
    id: Date.now(),
  };
  details.push(newData);
  localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
  return newData;
}

export function getBasicInfo(page: number = 1, limit: number = 10) {
  const basicInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.BASIC_INFO) || '[]') as BasicInfo[];
  const sorted = basicInfo.sort((a, b) => (b.id || 0) - (a.id || 0));
  const from = (page - 1) * limit;
  const to = from + limit;
  return {
    data: sorted.slice(from, to),
    total: basicInfo.length,
  };
}

export function getDetails() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILS) || '[]') as Details[];
}

export function getMergedEmployees(page: number = 1, limit: number = 10): {
  employees: Employee[];
  total: number;
} {
  const basicInfo = getBasicInfo(page, limit);
  const details = getDetails();

  const employees = basicInfo.data.map(basic => {
    const detail = details.find(d => d.email === basic.email || d.employee_id === basic.employee_id);
    return {
      ...basic,
      photo: detail?.photo,
      employment_type: detail?.employment_type,
      office_location: detail?.office_location,
      notes: detail?.notes,
      user_role: detail?.user_role,
    } as Employee;
  });

  return {
    employees,
    total: basicInfo.total,
  };
}
