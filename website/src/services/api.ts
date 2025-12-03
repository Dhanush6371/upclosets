import { config } from '../config';

// Interface for consultation form data
export interface ConsultationFormData {
  phone: string;
  name: string;
  address: string;
  zip_code: string;
  closet_type: string;
  number_of_spaces: number;
  consultation_type: 'phone_only' | 'in_person' | 'virtual';
  preferred_date: string;
  preferred_time: string;
}

// Interface for API responses
interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  error?: string;
}

interface ConsultationResponse {
  consultation: {
    _id: string;
    phone: string;
    name: string;
    address: string;
    zip_code: string;
    closet_type: string;
    number_of_spaces: number;
    consultation_type: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    confirmation_status: string;
    phone_source: string;
    created_at: string;
  };
}

// Update backend URL to use port 5000 (the actual backend port)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Submit a consultation request
 */
export const submitConsultation = async (
  formData: ConsultationFormData
): Promise<ConsultationResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data: ApiResponse<ConsultationResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit consultation request');
    }

    if (data.status === 'success' && data.data) {
      return data.data;
    }

    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Submit consultation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to submit consultation request');
  }
};

