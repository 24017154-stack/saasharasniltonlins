// User types
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR';
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: 'ADMIN' | 'INSTRUCTOR';
  name: string;
}

// Student types
export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalNotes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalNotes?: string;
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalNotes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Plan types
export interface Plan {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  creditsIncluded: number;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Subscription {
  id: string;
  studentId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  plan?: Plan;
  student?: Student;
}

// Invoice types
export interface Invoice {
  id: string;
  studentId: string;
  subscriptionId?: string;
  amountCents: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  subscription?: Subscription;
}

// Credit ledger types
export interface CreditEntry {
  id: string;
  studentId: string;
  subscriptionId?: string;
  bookingId?: string;
  amount: number;
  type: 'GRANTED' | 'CONSUMED' | 'REFUNDED' | 'EXPIRED';
  description?: string;
  createdAt: string;
}

// Time slot types
export interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  maxCapacity: number;
  isActive: boolean;
  createdAt: string;
}

// Holiday types
export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHolidayDto {
  name: string;
  date: string;
  isRecurring?: boolean;
}

export interface UpdateHolidayDto {
  name?: string;
  date?: string;
  isRecurring?: boolean;
}

// Booking types
export interface Booking {
  id: string;
  studentId: string;
  instructorId?: string;
  timeSlotId: string;
  scheduledDate: string; // YYYY-MM-DD format
  scheduledStart: string; // ISO datetime
  scheduledEnd: string; // ISO datetime
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  cancellationReason?: string;
  cancelledAt?: string;
  attendanceMarkedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  instructor?: User;
  timeSlot?: TimeSlot;
}

export interface CreateBookingDto {
  studentId: string;
  timeSlotId: string;
  scheduledDate: string; // YYYY-MM-DD format
  instructorId?: string;
  notes?: string;
}

export interface UpdateBookingDto {
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  cancellationReason?: string;
  notes?: string;
}

// Availability types
export interface AvailabilitySlot {
  timeSlotId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  availableSpots: number;
  maxCapacity: number;
}

export interface AvailabilityQuery {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  instructorId?: string;
}

// Dashboard types
export interface DashboardOverview {
  totalStudents: number;
  todayBookings: number;
  monthRevenue: number;
  delinquentCount: number;
}

// Auth types
export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface StudentFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  search?: string;
}

export interface InvoiceFilters {
  studentId?: string;
  status?: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
}

export interface BookingFilters {
  studentId?: string;
  instructorId?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  startDate?: string;
  endDate?: string;
}