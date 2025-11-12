import { BasicInfo, Details, Employee, Department } from './types';

const STORAGE_KEYS = {
  BASIC_INFO: 'employees_basic_info',
  DETAILS: 'employees_details',
  DEPARTMENTS: 'departments',
  LOCATIONS: 'locations',
};

// export function initializeMockData() {
//   if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
//     getDepartments().then((departments) => {
//       if (Array.isArray(departments)) {
//       localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
//       } else {
//       localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify([]));
//       }
//     }).catch(() => {
//       // localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify([]));
//     });
//   }

//   if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
//       getLocations().then((locations) => {
//       if (Array.isArray(locations)) {
//       localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
//       } else {
//       localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify([]));
//       }
//     }).catch(() => {
//       localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify([]));
//     });
//   }

//   // if (!localStorage.getItem(STORAGE_KEYS.BASIC_INFO)) {
//   //   localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify([]));
//   // }

//   // if (!localStorage.getItem(STORAGE_KEYS.DETAILS)) {
//   //   localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify([]));
//   // }
// }

// export function getDepartments(search?: string) {
//   const departments = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
//   if (!search) return departments;
//   return departments.filter((dept: any) =>
//     dept.name.toLowerCase().includes(search.toLowerCase())
//   );
// }

export async function getDepartments(search?: string): Promise<Department[]> {
  try {
  const base = process.env.NEXT_PUBLIC_API_STEP1 || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/departments`);
    if (search) url.searchParams.set('name_like', search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch departments: ${res.status}`);
    const departments = await res.json();
    return departments;
  } catch {
    // const departments = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
    // if (!search) return departments;
    // return departments.filter((dept: Department) =>
    //   dept.name.toLowerCase().includes(search.toLowerCase())
    // );
  }
}

// export function getLocations(search?: string) {
//   const locations = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCATIONS) || '[]');
//   if (!search) return locations;
//   return locations.filter((loc: any) =>
//     loc.name.toLowerCase().includes(search.toLowerCase())
//   );
// }

export async function getLocations(search?: string): Promise<Department[]> {
  try {
  const base = process.env.NEXT_PUBLIC_API_STEP2 || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/locations`);
    if (search) url.searchParams.set('name_like', search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch location: ${res.status}`);
    const locations = await res.json();
    return locations
  } catch {
    const locations = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCATIONS) || '[]') as Department[];
    if (!search) return locations;
    return locations.filter((dept: Department) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
  }
}

export function generateEmployeeId(department: string): string {
  const deptPrefix = department.substring(0, 3).toUpperCase();
  // simple fallback id generator; server should normally provide canonical id
  const nextNumber = Date.now().toString().slice(-6);
  return `${deptPrefix}-${nextNumber}`;
}

// export function addBasicInfo(data: BasicInfo): BasicInfo {
  // const basicInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.BASIC_INFO) || '[]') as BasicInfo[];
  // const newData = {
  //   ...data,
  //   id: Date.now(),
  // };
  // basicInfo.push(newData);
  // localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify(basicInfo));
  // return newData;
// }

export async function addBasicInfo(data: BasicInfo): Promise<BasicInfo> {
  const newData = {
    ...data,
    // server will assign canonical id; add temporary timestamp id if needed
    id: Date.now(),
  } as BasicInfo;

  try {
  const base = process.env.NEXT_PUBLIC_API_STEP1 || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/basicInfo`);
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    if (!res.ok) throw new Error(`Failed to POST basicInfo: ${res.status}`);
    const created = await res.json();
    return created as BasicInfo;
  } catch {
    // if API fails, throw so caller can handle errors upstream
    throw new Error('Failed to persist basic info to API');
  }
}

// export function addDetails(data: Details): Details {
//   const details = JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILS) || '[]') as Details[];
//   const newData = {
//     ...data,
//     id: Date.now(),
//   };
//   details.push(newData);
//   localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
//   return newData;
// }

export async function addDetails(data: Details): Promise<Details> {
  const newData = {
    ...data,
    id: Date.now(),
  } as Details;

  try {
    const base = process.env.NEXT_PUBLIC_API_STEP2 || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/details`);
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    if (!res.ok) throw new Error(`Failed to POST details: ${res.status}`);
    const created = await res.json();
    return created as Details;
  } catch {
    throw new Error('Failed to persist details to API');
  }
}

// export function getBasicInfo(page: number = 1, limit: number = 10) {
//   const basicInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.BASIC_INFO) || '[]') as BasicInfo[];
//   const sorted = basicInfo.sort((a, b) => (b.id || 0) - (a.id || 0));
//   const from = (page - 1) * limit;
//   const to = from + limit;
//   return {
//     data: sorted.slice(from, to),
//     total: basicInfo.length,
//   };
// 
export async function getBasicInfo(page: number = 1, limit: number = 10) {
  const from = (page - 1) * limit;
  const to = from + limit;
  try {
    const base = process.env.NEXT_PUBLIC_API_STEP1 || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/basicInfo`);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch basicInfo: ${res.status}`);
    const serverData: BasicInfo[] = await res.json();
    const sorted = serverData.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
    // localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify(sorted));
    return {
      data: sorted.slice(from, to),
      total: serverData.length,
    };
  } catch {
    throw new Error('Failed to load basic info from API');
  }
}

// export function getDetails() {
//   return JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILS) || '[]') as Details[];
// }
export async function getDetails(): Promise<Details[]> {
  try {
  const base = process.env.NEXT_PUBLIC_API_STEP2 || '';
    const url = new URL(`${base.replace(/\/+$/,'')}/details`);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch details: ${res.status}`);
    const serverData: Details[] = await res.json();
    // localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(serverData));
    return serverData;
  } catch {
    throw new Error('Failed to load details from API');
  }
}

export async function getMergedEmployees(page: number = 1, limit: number = 10){
  const basicInfo = await getBasicInfo(page, limit);
  const details = await getDetails();
  console.log(basicInfo,details)
  const employees = basicInfo?.data?.map(basic => {
    const detail = details.find(d => d.email === basic.email || d.employee_id === basic.employee_id);
    // const detail = details.filter(d => d.email === basic.email || d.employee_id === basic.employee_id);
    console.log(detail)
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
