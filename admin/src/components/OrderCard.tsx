import { useState } from 'react';
import { Calendar, Package2, ArrowRight, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, Department } from '../types';
import DepartmentMessageModal from './DepartmentMessageModal';
import { formatDate } from '../utils/dateUtils';

interface OrderCardProps {
  order: Order;
  department: Department;
  onUpdateDesign?: (completed: boolean) => void;
  onUpdateProduction?: (percentage: number) => void;
  onUpdateFinishing?: (completed: boolean) => void;
  onUpdateDispatch?: (completed: boolean) => void;
  onMoveToNext?: (message?: string) => void;
}

  export default function OrderCard({
    order,
    department,
    onUpdateDesign,
    onUpdateProduction,
    onUpdateFinishing,
    onUpdateDispatch,
    onMoveToNext,
  }: OrderCardProps) {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const getStageLabel = () => {
      switch (order.progressStage) {
        case 'pending': return 'Pending';
        case 'in_design': return 'In Design';
        case 'in_production': return 'In Production';
        case 'in_finishing': return 'In Finishing';
        case 'in_dispatch': return 'Ready to Dispatch';
        case 'dispatched': return 'Dispatched';
        default: return 'Unknown';
      }
    };

    const getStageColor = () => {
      switch (order.progressStage) {
        case 'pending': return 'bg-gray-100 text-gray-700';
        case 'in_design': return 'bg-blue-100 text-blue-700';
        case 'in_production': return 'bg-yellow-100 text-yellow-700';
        case 'in_finishing': return 'bg-orange-100 text-orange-700';
        case 'in_dispatch': return 'bg-purple-100 text-purple-700';
        case 'dispatched': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const getProgressPercentage = () => {
      if (order.dispatchCompleted) return 100;
      if (order.finishingCompleted) return 87.5;
      if (order.productionPercentage === 100) return 75;
      if (order.designCompleted) return 25 + (order.productionPercentage * 0.5);
      if (order.progressStage !== 'pending') return 12.5;
      return 0;
    };

    const progressPercentage = getProgressPercentage();

    // Department progression logic
    const getNextDepartment = () => {
      const departmentFlow = {
        'admin': 'Design',
        'design': 'Production', 
        'production': 'Finishing',
        'finishing': 'Dispatch',
        'dispatch': 'Completed'
      };
      return departmentFlow[order.currentDepartment as keyof typeof departmentFlow] || 'Unknown';
    };

    const canMoveToNext = () => {
      switch (order.currentDepartment) {
        case 'admin':
          return true; // Admin can always move to design
        case 'design':
          return order.designCompleted;
        case 'production':
          return order.productionPercentage === 100;
        case 'finishing':
          return order.finishingCompleted;
        case 'dispatch':
          return order.dispatchCompleted;
        default:
          return false;
      }
    };

    const isCurrentDepartment = () => {
      return department === order.currentDepartment || department === 'overall';
    };

    const handleMoveToNext = () => {
      setShowMessageModal(true);
    };

    const handleSendMessage = (message: string) => {
      onMoveToNext?.(message);
    };

    const getDepartmentName = (dept: string) => {
      switch (dept) {
        case 'admin': return 'Admin';
        case 'design': return 'Design Team';
        case 'production': return 'Production Team';
        case 'finishing': return 'Finishing Team';
        case 'dispatch': return 'Dispatch Team';
        default: return dept;
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Package2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{order.orderId}</h3>
                <p className="text-gray-600 text-sm">{order.customerName}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor()}`}>
              {getStageLabel()}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Expected Dates Section */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Expected Completion Dates</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {!order.designCompleted && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Design:</span>
                  <span className="font-medium">{formatDate(order.expectedDates.design)}</span>
                </div>
              )}
              {order.productionPercentage !== 100 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Production:</span>
                  <span className="font-medium">{formatDate(order.expectedDates.production)}</span>
                </div>
              )}
              {!order.finishingCompleted && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Finishing:</span>
                  <span className="font-medium">{formatDate(order.expectedDates.finishing)}</span>
                </div>
              )}
              {!order.dispatchCompleted && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dispatch:</span>
                  <span className="font-medium">{formatDate(order.expectedDates.dispatch)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Design Team Button */}
          {department === 'design' && order.progressStage === 'in_design' && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => onUpdateDesign?.(!order.designCompleted)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  order.designCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {order.designCompleted ? 'Design Completed' : 'Mark Design Complete'}
              </button>
            </div>
          )}

          {/* ✅ Updated Production Team Button */}
          {department === 'production' && order.progressStage === 'in_production' && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => onUpdateProduction?.(order.productionPercentage === 100 ? 0 : 100)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  order.productionPercentage === 100
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {order.productionPercentage === 100 ? 'Production Completed' : 'Mark Production Complete'}
              </button>
            </div>
          )}

          {/* Finishing Team Button */}
          {department === 'finishing' && order.progressStage === 'in_finishing' && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => onUpdateFinishing?.(!order.finishingCompleted)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  order.finishingCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {order.finishingCompleted ? 'Finishing Completed' : 'Mark Finishing Complete'}
              </button>
            </div>
          )}

          {/* Dispatch Team Button */}
          {department === 'dispatch' && order.progressStage === 'in_dispatch' && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => onUpdateDispatch?.(!order.dispatchCompleted)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  order.dispatchCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {order.dispatchCompleted ? 'Dispatched' : 'Mark as Dispatched'}
              </button>
            </div>
          )}

          {/* Department Messages Section */}
          {order.departmentMessages && order.departmentMessages.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="w-full flex items-center justify-between py-2 px-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Department Messages ({order.departmentMessages.length})</span>
                </div>
                {showMessages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showMessages && (
                <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
                  {order.departmentMessages.map((msg, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-700">
                            {getDepartmentName(msg.fromDepartment)}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-gray-700">
                            {getDepartmentName(msg.toDepartment)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.sentAt)}
                        </span>
                      </div>
                      <p className="text-gray-600">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Department Progression Button - Show for each department */}
          {isCurrentDepartment() && order.currentDepartment !== 'dispatched' && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleMoveToNext}
                disabled={!canMoveToNext()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  canMoveToNext()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>
                  {order.currentDepartment === 'admin' && 'Send to Design Team'}
                  {order.currentDepartment === 'design' && 'Send to Production Team'}
                  {order.currentDepartment === 'production' && 'Send to Finishing Team'}
                  {order.currentDepartment === 'finishing' && 'Send to Dispatch Team'}
                  {order.currentDepartment === 'dispatch' && 'Mark as Completed'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!canMoveToNext() && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Complete current tasks to move to next department
                </p>
              )}
            </div>
          )}
        </div>

        {/* Message Modal */}
        <DepartmentMessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
          fromDepartment={order.currentDepartment}
          toDepartment={getNextDepartment().toLowerCase()}
          orderId={order.orderId}
        />
      </div>
    );
  }
