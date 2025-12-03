import { Order, Consultation, ConsultationStatus, ConfirmationStatus } from '../types';

// Use hardcoded API URL instead of environment variables
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers (use sessionStorage to match AuthContext)
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle responses
const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    sessionStorage.removeItem('token');
    // Don't redirect automatically - let the component handle it
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Order API functions
export const orderApi = {
  // Get next order ID
  getNextOrderId: async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/orders/next-id`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.data.nextOrderId;
  },

  // Create new order
  createOrder: async (customerName: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ customerName })
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Get all orders
  getOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.data.orders;
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Update order design status
  updateDesign: async (id: string, completed: boolean): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/design`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed })
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Update order production status
  updateProduction: async (id: string, percentage: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/production`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ percentage })
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Update order finishing status
  updateFinishing: async (id: string, completed: boolean): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/finishing`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed })
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Update order dispatch status
  updateDispatch: async (id: string, completed: boolean): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/dispatch`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed })
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Move order to next department
  moveToNextDepartment: async (id: string, message?: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/move-to-next`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    const data = await handleResponse(response);
    return data.data.order;
  },

  // Delete order
  deleteOrder: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  }
};

// Consultation API functions
export const consultationApi = {
  // Get all consultations
  getConsultations: async (): Promise<Consultation[]> => {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.data.consultations;
  },

  // Get single consultation
  getConsultation: async (id: string): Promise<Consultation> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.data.consultation;
  },

  // Update consultation status
  updateStatus: async (id: string, status: ConsultationStatus, notes?: string): Promise<Consultation> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    const data = await handleResponse(response);
    return data.data.consultation;
  },

  // Update consultation confirmation status
  updateConfirmationStatus: async (id: string, confirmation_status: ConfirmationStatus): Promise<Consultation> => {
    const response = await fetch(`${API_BASE_URL}/consultations/${id}/confirmation`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ confirmation_status })
    });
    const data = await handleResponse(response);
    return data.data.consultation;
  }
};

// Dashboard Statistics API functions
export const statisticsApi = {
  // Get dashboard statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/statistics`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data.data;
  }
};

// Admin API functions
export const adminApi = {
  // Send SMS via backend admin endpoint
  sendSms: async (to: string, message?: string): Promise<{ sid: string; to: string; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/send-sms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ to, message })
    });
    const data = await handleResponse(response);
    return data.data;
  }
};