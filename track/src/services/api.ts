import axios from 'axios';
import { Order, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const trackOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get<ApiResponse<{ order: Order }>>(`/track/${orderId}`);
    
    if (response.data.status === 'success' && response.data.data?.order) {
      return response.data.data.order;
    } else {
      throw new Error(response.data.message || 'Failed to fetch order');
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Order not found. Please check your order ID.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to track order. Please try again.');
    }
  }
};


