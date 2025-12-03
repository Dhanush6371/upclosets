import { LogOut, Package, Plus, BarChart3, List, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onCreateOrder: () => void;
  currentView?: 'orders' | 'statistics' | 'consultations';
  onViewChange?: (view: 'orders' | 'statistics' | 'consultations') => void;
}

export default function Sidebar({ onCreateOrder, currentView = 'orders', onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const getDepartmentName = () => {
    if (!user) return '';
    return user.department.charAt(0).toUpperCase() + user.department.slice(1);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Manager</h1>
            <p className="text-sm text-gray-600">{getDepartmentName()} Team</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Navigation for Admin */}
        {user?.department === 'overall' && (
          <div className="space-y-2 mb-6">
            <button
              onClick={() => onViewChange?.('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'orders'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </button>
            
            <button
              onClick={() => onViewChange?.('statistics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'statistics'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Statistics</span>
            </button>

            <button
              onClick={() => onViewChange?.('consultations')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'consultations'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Consultations</span>
            </button>
          </div>
        )}

        {/* Create Order Button for Admin */}
        {user?.department === 'overall' && currentView === 'orders' && (
          <button
            onClick={onCreateOrder}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create New Order</span>
          </button>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Signed in as:</p>
          <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
