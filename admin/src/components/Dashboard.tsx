import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import OrderCard from './OrderCard';
import Sidebar from './Sidebar';
import CreateOrderModal from './CreateOrderModal';
import StatisticsDashboard from './StatisticsDashboard';
import ConsultationsView from './ConsultationsView';
import AIChatBot from './AIChatBot';
import { Order } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const { orders, loading, error, updateOrderDesign, updateOrderProduction, updateOrderFinishing, updateOrderDispatch, moveOrderToNextDepartment } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'orders' | 'statistics' | 'consultations'>('orders');

  const filterOrdersByDepartment = (order: Order) => {
    if (!user) return false;

    switch (user.department) {
      case 'design':
        return order.currentDepartment === 'design' || order.progressStage === 'in_design';
      case 'production':
        return order.currentDepartment === 'production' || order.progressStage === 'in_production';
      case 'finishing':
        return order.currentDepartment === 'finishing' || order.progressStage === 'in_finishing';
      case 'dispatch':
        return order.currentDepartment === 'dispatch' || order.progressStage === 'in_dispatch';
      case 'overall':
        return true;
      default:
        return false;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesDepartment = filterOrdersByDepartment(order);
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStage === 'all' || order.progressStage === filterStage;

      return matchesDepartment && matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStage, user]);

  const getDepartmentTitle = () => {
    if (!user) return '';
    if (user.department === 'overall' && viewMode === 'statistics') {
      return 'Statistics Dashboard';
    }
    if (user.department === 'overall' && viewMode === 'consultations') {
      return 'Consultations Dashboard';
    }
    switch (user.department) {
      case 'design': return 'Design Team Dashboard';
      case 'production': return 'Production Team Dashboard';
      case 'finishing': return 'Finishing Team Dashboard';
      case 'dispatch': return 'Dispatch Team Dashboard';
      case 'overall': return 'Overall Dashboard';
      default: return 'Dashboard';
    }
  };

  const getDepartmentDescription = () => {
    if (!user) return '';
    if (user.department === 'overall' && viewMode === 'statistics') {
      return 'Comprehensive analytics and performance metrics for order management';
    }
    if (user.department === 'overall' && viewMode === 'consultations') {
      return 'Manage customer consultations and appointment scheduling';
    }
    switch (user.department) {
      case 'design': return 'Manage design approvals and mark orders ready for production';
      case 'production': return 'Track production progress and update completion percentage';
      case 'finishing': return 'Manage finishing tasks and mark orders ready for dispatch';
      case 'dispatch': return 'Process dispatch requests and mark orders as delivered';
      case 'overall': return 'Monitor all orders across all departments';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        onCreateOrder={() => setShowCreateModal(true)}
        currentView={viewMode}
        onViewChange={setViewMode}
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getDepartmentTitle()}</h1>
            <p className="text-gray-600">{getDepartmentDescription()}</p>
          </div>

          {/* Show Statistics Dashboard for Admin */}
          {user?.department === 'overall' && viewMode === 'statistics' ? (
            <StatisticsDashboard />
          ) : user?.department === 'overall' && viewMode === 'consultations' ? (
            <ConsultationsView />
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by Order ID or Customer Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {user?.department === 'overall' && (
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={filterStage}
                        onChange={(e) => setFilterStage(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="all">All Stages</option>
                        <option value="pending">Pending</option>
                        <option value="in_design">In Design</option>
                        <option value="in_production">In Production</option>
                        <option value="in_finishing">In Finishing</option>
                        <option value="in_dispatch">Ready to Dispatch</option>
                        <option value="dispatched">Dispatched</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Orders...</h3>
              <p className="text-gray-600">Please wait while we fetch your orders</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl shadow-md p-12 text-center">
              <div className="text-red-400 mb-4">
                <Filter className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Orders</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Filter className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStage !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No orders available for your department'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  department={user!.department}
                  onUpdateDesign={(completed) => updateOrderDesign(order._id, completed)}
                  onUpdateProduction={(percentage) => updateOrderProduction(order._id, percentage)}
                  onUpdateFinishing={(completed) => updateOrderFinishing(order._id, completed)}
                  onUpdateDispatch={(completed) => updateOrderDispatch(order._id, completed)}
                  onMoveToNext={(message) => moveOrderToNextDepartment(order._id, message)}
                />
              ))}
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {showCreateModal && <CreateOrderModal onClose={() => setShowCreateModal(false)} />}
      
      {/* AI ChatBot - Available for Overall Department */}
      {user?.department === 'overall' && <AIChatBot />}
    </div>
  );
}
