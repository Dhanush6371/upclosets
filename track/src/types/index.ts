export interface Order {
  orderId: string;
  customerName: string;
  progressStage: 'pending' | 'in_design' | 'in_production' | 'in_finishing' | 'in_dispatch' | 'dispatched';
  currentDepartment: 'admin' | 'design' | 'production' | 'finishing' | 'dispatch' | 'dispatched';
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
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
}


