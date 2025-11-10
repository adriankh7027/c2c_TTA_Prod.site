import { User, Plan, Allocation, SystemSettings } from '../types';

// UPDATED: Set to the correct local development API URL
const BASE_URL = 'http://tta-api.runasp.net/api';
//const BASE_URL = 'https://localhost:7116/api';


// --- Helper for API calls ---
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Try to get more detailed error info from the response body
      const errorBody = await response.text();
      console.error(`HTTP error! status: ${response.status}`, `Endpoint: ${endpoint}`, `Response: ${errorBody}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle 'No Content' responses (like for DELETE)
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Fetch API call failed:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

// --- API Service Functions ---

// DTOs for requests that require an actor's ID for auditing
interface UserUpdateRequestDto extends Partial<Omit<User, 'id' | 'pin'>> {
  actorUserId: number;
  newPin?: string;
  currentPin?: string;
}
interface UserCreateRequestDto extends Omit<User, 'id' | 'pin'> {
  actorUserId: number;
}
interface SystemSettingsUpdateDto extends SystemSettings {
  actorUserId: number;
}
interface UpdateHolidaysRequestDto {
  holidayDates: string[];
  actorUserId: number;
}
interface GenerateAllocationsDto {
    actorUserId: number;
    year: number;
    month: number;
}

// Auth
export const apiLogin = (identifier: string, pin: string): Promise<User> => {
  return fetchApi('/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, pin }),
  });
};

// Users
export const fetchUsers = (): Promise<User[]> => fetchApi('/users');
export const updateUser = (id: number, userData: UserUpdateRequestDto): Promise<void> => fetchApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
export const addUser = (userData: UserCreateRequestDto): Promise<User> => fetchApi('/users', { method: 'POST', body: JSON.stringify(userData) });
export const deleteUser = (id: number): Promise<void> => fetchApi(`/users/${id}`, { method: 'DELETE' });

// Plans
export const submitPlan = (planData: Omit<Plan, 'userName'>): Promise<void> => fetchApi('/plans', { method: 'POST', body: JSON.stringify(planData) });
export const fetchPlans = (year: number, month: number): Promise<Plan[]> => fetchApi(`/plans?year=${year}&month=${month}`);
export const fetchUpdatedUsers = (): Promise<string[]> => fetchApi('/plan-updates');


// Allocations
export const generateAllocations = (dto: GenerateAllocationsDto): Promise<Allocation[]> => fetchApi('/allocations/generate', { method: 'POST', body: JSON.stringify(dto) });
export const fetchAllocations = (year: number, month: number): Promise<Allocation[]> => fetchApi(`/allocations?year=${year}&month=${month}`);

// Settings
export const fetchSystemSettings = (): Promise<SystemSettings> => fetchApi('/settings');
export const updateSystemSettings = (settings: SystemSettingsUpdateDto): Promise<void> => fetchApi('/settings', { method: 'PUT', body: JSON.stringify(settings) });

// Holidays
export const fetchHolidays = (): Promise<string[]> => fetchApi('/holidays');
export const updateHolidays = (dto: UpdateHolidaysRequestDto): Promise<void> => {
  // Based on the 400 Bad Request error ("The JSON value could not be converted..."),
  // the backend expects a JSON object that maps to its DTO, not a raw array.
  // The API expects:
  // 1. The actor's user ID as a query parameter (`?actorUserId=...`).
  // 2. A JSON object like `{ "holidayDates": ["2024-01-01", ...] }` in the request body.
  return fetchApi(`/holidays?actorUserId=${dto.actorUserId}`, { 
    method: 'PUT', 
    body: JSON.stringify({ holidayDates: dto.holidayDates }) 
  });
}