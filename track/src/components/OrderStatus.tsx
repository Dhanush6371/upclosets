import React from 'react';
import { Order } from '../types';
import { formatDate } from '../utils/dateUtils';

interface OrderStatusProps {
  order: Order;
  onReset: () => void;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order, onReset }) => {
  const getStatusText = (stage: string) => {
    switch (stage) {
      case 'pending': return 'Order Received';
      case 'in_design': return 'Design Phase';
      case 'in_production': return 'Production';
      case 'in_finishing': return 'Finishing';
      case 'in_dispatch': return 'Dispatch Ready';
      case 'dispatched': return 'Dispatched';
      default: return stage;
    }
  };

  const getProgressPercentage = () => {
    switch (order.progressStage) {
      case 'pending': return 16;
      case 'in_design': return order.designCompleted ? 33 : 25;
      case 'in_production': return 33 + (order.productionPercentage * 0.4);
      case 'in_finishing': return order.finishingCompleted ? 83 : 75;
      case 'in_dispatch': return order.dispatchCompleted ? 95 : 83;
      case 'dispatched': return 100;
      default: return 0;
    }
  };

  const progressPercentage = getProgressPercentage();

  const timelineData = [
    { 
      stage: 'pending', 
      label: 'Order Received', 
      description: 'Order confirmed and processing started',
      completed: true, 
      icon: '📋',
      date: order.createdAt,
      expectedDate: null,
      iconBg: 'bg-amber-500'
    },
    { 
      stage: 'in_design', 
      label: 'Design', 
      description: 'Creating and approving designs',
      completed: order.designCompleted, 
      icon: '🎨',
      date: order.updatedAt,
      expectedDate: order.expectedDates.design,
      iconBg: 'bg-indigo-500'
    },
    { 
      stage: 'in_production', 
      label: 'Production', 
      description: 'Manufacturing in progress',
      completed: order.productionPercentage === 100, 
      icon: '⚙️',
      date: order.updatedAt,
      expectedDate: order.expectedDates.production,
      iconBg: 'bg-purple-500'
    },
    { 
      stage: 'in_finishing', 
      label: 'Finishing', 
      description: 'Quality checks and final touches',
      completed: order.finishingCompleted, 
      icon: '✨',
      date: order.updatedAt,
      expectedDate: order.expectedDates.finishing,
      iconBg: 'bg-pink-500'
    },
    { 
      stage: 'in_dispatch', 
      label: 'Dispatch', 
      description: 'Packaging and shipping preparation',
      completed: order.dispatchCompleted, 
      icon: '📦',
      date: order.updatedAt,
      expectedDate: order.expectedDates.dispatch,
      iconBg: 'bg-teal-500'
    },
    { 
      stage: 'dispatched', 
      label: 'Completed', 
      description: 'Order delivered successfully',
      completed: order.progressStage === 'dispatched', 
      icon: '✅',
      date: order.updatedAt,
      expectedDate: null,
      iconBg: 'bg-emerald-500'
    }
  ];

  const activeIndex = timelineData.findIndex(item => item.stage === order.progressStage);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Order #{order.orderId}</h1>
                <p className="text-indigo-100">
                  {order.customerName} • Created {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>New Search</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            {getStatusText(order.progressStage)}
          </span>
          <span className="text-indigo-100 text-sm">
            Updated: {formatDate(order.updatedAt)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Production Progress</h3>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-purple-500 to-emerald-500 transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Redesigned Horizontal Line Graph Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-8">Production Journey</h3>
        
        <div className="relative">
          {/* Main Horizontal Line */}
          <div className="absolute left-8 right-8 top-12 h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress Line */}
            <div 
              className="h-2 bg-gradient-to-r from-amber-400 via-purple-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(activeIndex / (timelineData.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Timeline Items */}
          <div className="grid grid-cols-6 gap-4 relative z-10">
            {timelineData.map((item, index) => {
              const isCompleted = item.completed;
              const isActive = index === activeIndex;
              const isUpcoming = index > activeIndex;
              
              return (
                <div key={item.stage} className="flex flex-col items-center">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center mb-3 transition-all duration-300 transform hover:scale-110 ${
                    isCompleted 
                      ? `${item.iconBg} border-white shadow-2xl shadow-emerald-500/30` 
                      : isActive
                      ? `${item.iconBg} border-white shadow-2xl shadow-purple-500/30 animate-pulse`
                      : isUpcoming
                      ? 'bg-gray-100 border-gray-200 text-gray-400'
                      : 'bg-amber-100 border-amber-200 text-amber-600'
                  }`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>

                  {/* Connection Point */}
                  <div className={`w-4 h-4 rounded-full border-4 mb-3 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-white shadow-lg' 
                      : isActive
                      ? 'bg-purple-500 border-white shadow-lg'
                      : isUpcoming
                      ? 'bg-gray-300 border-white'
                      : 'bg-amber-400 border-white'
                  }`}></div>

                  {/* Content */}
                  <div className="text-center px-2">
                    <div className={`font-semibold text-sm mb-1 ${
                      isCompleted ? 'text-emerald-600' : 
                      isActive ? 'text-purple-600' : 
                      isUpcoming ? 'text-gray-400' : 'text-amber-600'
                    }`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 min-h-[2rem]">
                      {item.description}
                    </div>
                    {item.expectedDate && !item.completed && (
                      <div className="inline-flex items-center px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg mb-2">
                        <svg className="w-3 h-3 text-amber-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                         <span className="text-xs font-medium text-amber-700">
                           Expected: {formatDate(item.expectedDate)}
                         </span>
                      </div>
                    )}
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700' : 
                      isActive ? 'bg-purple-100 text-purple-700' : 
                      isUpcoming ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
          
          <div className="space-y-4">
            {[
              { 
                label: 'Design', 
                value: order.designCompleted ? 'Completed' : 'In Progress', 
                color: order.designCompleted ? 'emerald' : 'indigo',
                icon: '🎨',
                progress: order.designCompleted ? 100 : 75,
                expectedDate: order.expectedDates.design
              },
              { 
                label: 'Production', 
                value: `${order.productionPercentage}%`, 
                color: 'purple',
                icon: '⚙️',
                progress: order.productionPercentage,
                expectedDate: order.expectedDates.production
              },
              { 
                label: 'Finishing', 
                value: order.finishingCompleted ? 'Completed' : 'Pending', 
                color: order.finishingCompleted ? 'emerald' : 'pink',
                icon: '✨',
                progress: order.finishingCompleted ? 100 : 25,
                expectedDate: order.expectedDates.finishing
              },
              { 
                label: 'Dispatch', 
                value: order.dispatchCompleted ? 'Ready' : 'Pending', 
                color: order.dispatchCompleted ? 'emerald' : 'teal',
                icon: '📦',
                progress: order.dispatchCompleted ? 100 : 10,
                expectedDate: order.expectedDates.dispatch
              }
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                    stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                    stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    stat.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                    'bg-teal-100 text-teal-600'
                  }`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stat.label}</div>
                    <div className={`text-sm font-semibold ${
                      stat.color === 'emerald' ? 'text-emerald-600' :
                      stat.color === 'indigo' ? 'text-indigo-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      stat.color === 'pink' ? 'text-pink-600' :
                      'text-teal-600'
                    }`}>
                      {stat.value}
                    </div>
                    {!(
                      (stat.label === 'Design' && order.designCompleted) ||
                      (stat.label === 'Production' && order.productionPercentage === 100) ||
                      (stat.label === 'Finishing' && order.finishingCompleted) ||
                      (stat.label === 'Dispatch' && order.dispatchCompleted)
                    ) && (
                      <div className="inline-flex items-center mt-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                        <svg className="w-3 h-3 text-amber-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                         <span className="text-xs font-medium text-amber-700">
                           {formatDate(stat.expectedDate)}
                         </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      stat.color === 'emerald' ? 'bg-emerald-500' :
                      stat.color === 'indigo' ? 'bg-indigo-500' :
                      stat.color === 'purple' ? 'bg-purple-500' :
                      stat.color === 'pink' ? 'bg-pink-500' :
                      'bg-teal-500'
                    }`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Current Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-purple-100 text-sm">Current Department</div>
                  <div className="font-semibold capitalize">
                    {order.currentDepartment.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-purple-100 text-sm">Start Date</div>
                <div className="font-semibold">{formatDate(order.createdAt)}</div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-purple-100 text-sm">Last Update</div>
                <div className="font-semibold">{formatDate(order.updatedAt)}</div>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-purple-100 text-sm mb-2">Next Step</div>
              <div className="font-semibold">
                {activeIndex < timelineData.length - 1 ? timelineData[activeIndex + 1].label : 'Completion'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderStatus;