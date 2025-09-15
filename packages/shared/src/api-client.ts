import {
  User,
  Student,
  Plan,
  Booking,
  Holiday,
  Invoice,
  DashboardOverview,
  AvailabilitySlot,
  CreateStudentDto,
  UpdateStudentDto,
  CreateBookingDto,
  UpdateBookingDto,
  CreateHolidayDto,
  UpdateHolidayDto,
  LoginDto,
  AuthResponse,
  PaginatedResponse,
  StudentFilters,
  InvoiceFilters,
  BookingFilters,
  AvailabilityQuery,
} from './types';

export class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(dto: LoginDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  // Student endpoints
  async getStudents(filters?: StudentFilters): Promise<PaginatedResponse<Student>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    return this.request<PaginatedResponse<Student>>(`/students?${params}`);
  }

  async getStudent(id: string): Promise<Student> {
    return this.request<Student>(`/students/${id}`);
  }

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    return this.request<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async updateStudent(id: string, dto: UpdateStudentDto): Promise<Student> {
    return this.request<Student>(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  async getStudentHistory(id: string): Promise<{ bookings: Booking[]; invoices: Invoice[] }> {
    return this.request<{ bookings: Booking[]; invoices: Invoice[] }>(`/students/${id}/history`);
  }

  async renewStudent(id: string, planId: string): Promise<{ subscription: any; invoice: Invoice }> {
    return this.request<{ subscription: any; invoice: Invoice }>(`/students/${id}/renew`, {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  // Plan endpoints
  async getPlans(): Promise<Plan[]> {
    return this.request<Plan[]>('/plans');
  }

  // Booking endpoints
  async getBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.instructorId) params.append('instructorId', filters.instructorId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    return this.request<PaginatedResponse<Booking>>(`/bookings?${params}`);
  }

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async markAttendance(id: string, status: 'COMPLETED' | 'NO_SHOW', notes?: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Calendar endpoints
  async getAvailability(query: AvailabilityQuery): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams();
    params.append('startDate', query.startDate);
    params.append('endDate', query.endDate);
    if (query.instructorId) params.append('instructorId', query.instructorId);

    return this.request<AvailabilitySlot[]>(`/calendar/availability?${params}`);
  }

  // Holiday endpoints
  async getHolidays(): Promise<Holiday[]> {
    return this.request<Holiday[]>('/holidays');
  }

  async createHoliday(dto: CreateHolidayDto): Promise<Holiday> {
    return this.request<Holiday>('/holidays', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async updateHoliday(id: string, dto: UpdateHolidayDto): Promise<Holiday> {
    return this.request<Holiday>(`/holidays/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  async deleteHoliday(id: string): Promise<void> {
    return this.request<void>(`/holidays/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoice endpoints
  async getInvoices(filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.status) params.append('status', filters.status);

    return this.request<PaginatedResponse<Invoice>>(`/invoices?${params}`);
  }

  // Dashboard endpoints
  async getDashboardOverview(): Promise<DashboardOverview> {
    return this.request<DashboardOverview>('/dashboard/overview');
  }

  // Health endpoints
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}