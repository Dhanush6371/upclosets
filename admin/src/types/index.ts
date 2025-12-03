export type Department = 'design' | 'production' | 'finishing' | 'dispatch' | 'overall';

export interface DepartmentMessage {
  fromDepartment: string;
  toDepartment: string;
  message: string;
  sentBy: {
    _id: string;
    email: string;
  };
  sentAt: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  orderDate: string;
  progressStage: ProgressStage;
  currentDepartment: string;
  designCompleted: boolean;
  productionPercentage: number;
  finishingCompleted: boolean;
  dispatchCompleted: boolean;
  expectedDates: {
    design: string;
    production: string;
    finishing: string;
    dispatch: string;
  };
  department: string;
  departmentMessages?: DepartmentMessage[];
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ProgressStage = 'pending' | 'in_design' | 'in_production' | 'in_finishing' | 'in_dispatch' | 'dispatched';

export interface User {
  _id: string;
  email: string;
  department: Department;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface OrdersResponse {
  status: string;
  results: number;
  data: {
    orders: Order[];
  };
}

// Consultation types
export interface Consultation {
  _id: string;
  phone: string;
  name: string;
  address: string;
  zip_code: string;
  closet_type: string;
  number_of_spaces: number;
  consultation_type: ConsultationType;
  preferred_date: string;
  preferred_time: string;
  status: ConsultationStatus;
  confirmation_status: ConfirmationStatus;
  phone_source: PhoneSource;
  notes?: string;
  assigned_to?: string;
  created_at: string;
}

export type ConsultationType = 'phone_only' | 'in_person' | 'virtual';
export type ConsultationStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';
export type ConfirmationStatus = 'pending' | 'confirmed' | 'cancelled';
export type PhoneSource = 'provided_by_customer' | 'lead_generation' | 'referral';

export interface ConsultationsResponse {
  status: string;
  results: number;
  data: {
    consultations: Consultation[];
  };
}

export interface ConsultationResponse {
  status: string;
  data: {
    consultation: Consultation;
  };
}

// Dashboard statistics types
export interface DashboardStatistics {
  overview: {
    totalOrders: number;
    recentOrders: number;
    weeklyOrders: number;
    todayOrders: number;
    avgCompletionTime: number;
    totalConsultations: number;
    recentConsultations: number;
    weeklyConsultations: number;
    todayConsultations: number;
  };
  ordersByStatus: Array<{
    _id: string;
    count: number;
  }>;
  ordersByDepartment: Array<{
    _id: string;
    count: number;
  }>;
  ordersByMonth: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
  }>;
  productionStats: {
    avgProduction: number;
    totalOrders: number;
  };
  consultationsByStatus: Array<{
    _id: string;
    count: number;
  }>;
  consultationsByType: Array<{
    _id: string;
    count: number;
  }>;
}

export interface StatisticsResponse {
  status: string;
  data: DashboardStatistics;
}