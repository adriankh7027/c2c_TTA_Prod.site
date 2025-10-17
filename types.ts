export enum Role {
  AllocationAdmin,
  User,
  SystemAdmin,
}

export interface User {
  id: number;
  name: string;
  role: Role;
  email?: string;
  sendEmail?: boolean;
  pin: string;
}

export interface Plan {
  userId: number;
  userName: string;
  month: number;
  year: number;
  selectedDays: number[];
}

export interface Allocation {
  date: string; // "YYYY-MM-DD"
  bookerId: number;
  bookerName: string;
  travelers: { id: number; name: string }[];
  tripType?: string;
}

export interface SystemSettings {
  departureLabel: string;
  arrivalLabel: string;
  tripPrice: number;
  allocateForCurrentMonth: boolean;
  userListViewEnabled: boolean;
}
