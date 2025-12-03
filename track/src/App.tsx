import React, { useState } from 'react';
import OrderTracker from './components/OrderTracker';
import OrderStatus from './components/OrderStatus';
import { Order } from './types';

function App() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderFound = (orderData: Order) => {
    setOrder(orderData);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setOrder(null);
  };

  const handleReset = () => {
    setOrder(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Enter your order ID to check the status of your order
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!order ? (
            <OrderTracker
              onOrderFound={handleOrderFound}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <OrderStatus order={order} onReset={handleReset} />
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


