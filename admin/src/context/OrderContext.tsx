
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Order, ProgressStage } from '../types';
import { orderApi } from '../services/api';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateOrderDesign: (orderId: string, completed: boolean) => Promise<void>;
  updateOrderProduction: (orderId: string, percentage: number) => Promise<void>;
  updateOrderFinishing: (orderId: string, completed: boolean) => Promise<void>;
  updateOrderDispatch: (orderId: string, completed: boolean) => Promise<void>;
  moveOrderToNextDepartment: (orderId: string, message?: string) => Promise<void>;
  createOrder: (customerName: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user, authInitialized } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await orderApi.getOrders();
      setOrders(ordersData);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        // Handle auth error gracefully
        setError('Session expired. Please log in again.');
        // Clear orders to prevent stale data
        setOrders([]);
      } else {
        setError('Failed to fetch orders');
        console.error('Fetch orders error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load orders when auth is ready and user is present
  useEffect(() => {
    if (!authInitialized) return;
    if (!user) {
      setOrders([]);
      return;
    }
    fetchOrders();
  }, [authInitialized, user]);

  const calculateProgressStage = (order: Order): ProgressStage => {
    if (order.dispatchCompleted) return 'dispatched';
    if (order.finishingCompleted) return 'in_dispatch';
    if (order.productionPercentage === 100) return 'in_finishing';
    if (order.designCompleted) return 'in_production';
    if (order.progressStage !== 'pending') return 'in_design';
    return 'pending';
  };

  const updateOrderDesign = async (orderId: string, completed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderApi.updateDesign(orderId, completed);
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to update design status');
        console.error('Update design error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderProduction = async (orderId: string, percentage: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderApi.updateProduction(orderId, percentage);
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to update production status');
        console.error('Update production error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderFinishing = async (orderId: string, completed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderApi.updateFinishing(orderId, completed);
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to update finishing status');
        console.error('Update finishing error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderDispatch = async (orderId: string, completed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderApi.updateDispatch(orderId, completed);
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to update dispatch status');
        console.error('Update dispatch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const moveOrderToNextDepartment = async (orderId: string, message?: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderApi.moveToNextDepartment(orderId, message);
      setOrders(prevOrders =>
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to move order to next department');
        console.error('Move to next department error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (customerName: string) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await orderApi.createOrder(customerName);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setError('Session expired. Please log in again.');
        throw new Error('Session expired. Please log in again.');
      } else {
        setError('Failed to create order');
        console.error('Create order error:', err);
        throw err; // Re-throw to let the component handle it
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      error,
      updateOrderDesign,
      updateOrderProduction,
      updateOrderFinishing,
      updateOrderDispatch,
      moveOrderToNextDepartment,
      createOrder,
      fetchOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}