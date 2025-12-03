import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { orderApi } from '../services/api';

interface CreateOrderModalProps {
  onClose: () => void;
}

export default function CreateOrderModal({ onClose }: CreateOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [nextOrderId, setNextOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingId, setIsLoadingId] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createOrder } = useOrders();

  useEffect(() => {
    const fetchNextOrderId = async () => {
      try {
        const orderId = await orderApi.getNextOrderId();
        setNextOrderId(orderId);
      } catch (error) {
        console.error('Failed to get next order ID:', error);
        setError('Failed to get next order ID');
        // Fallback to timestamp-based ID
        setNextOrderId(`ORD-${Date.now()}`);
      } finally {
        setIsLoadingId(false);
      }
    };

    fetchNextOrderId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      setError(null);
      try {
        await createOrder(customerName.trim());
        onClose();
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to create order');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <input
              id="orderId"
              type="text"
              value={isLoadingId ? 'Generating...' : nextOrderId}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Order ID is automatically generated
            </p>
          </div>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter customer name"
              required
              autoFocus
              disabled={isSubmitting || isLoadingId}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim() || isLoadingId}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}