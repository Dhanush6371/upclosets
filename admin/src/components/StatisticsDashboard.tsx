import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Clock, 
  BarChart3, 
  Loader,
  Phone,
  Calendar
} from 'lucide-react';
import { statisticsApi } from '../services/api';
import { DashboardStatistics } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function StatisticsDashboard() {
  const [data, setData] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const statistics = await statisticsApi.getStatistics();
        setData(statistics);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Statistics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-400 mb-4">
          <BarChart3 className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Statistics</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // Format data for charts
  const statusData = data.ordersByStatus.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count,
    color: COLORS[data.ordersByStatus.indexOf(item) % COLORS.length]
  }));

  const departmentData = data.ordersByDepartment.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: COLORS[data.ordersByDepartment.indexOf(item) % COLORS.length]
  }));

  const monthlyData = data.ordersByMonth.map(item => ({
    name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    orders: item.count
  }));

  const consultationStatusData = data.consultationsByStatus.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: COLORS[data.consultationsByStatus.indexOf(item) % COLORS.length]
  }));

  const consultationTypeData = data.consultationsByType.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count,
    color: COLORS[data.consultationsByType.indexOf(item) % COLORS.length]
  }));

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={data.overview.totalOrders}
            icon={Package}
            color="bg-blue-600"
            subtitle="All time"
          />
          <StatCard
            title="Recent Orders"
            value={data.overview.recentOrders}
            icon={TrendingUp}
            color="bg-green-600"
            subtitle="Last 30 days"
          />
          <StatCard
            title="Weekly Orders"
            value={data.overview.weeklyOrders}
            icon={BarChart3}
            color="bg-purple-600"
            subtitle="Last 7 days"
          />
          <StatCard
            title="Today's Orders"
            value={data.overview.todayOrders}
            icon={Clock}
            color="bg-orange-600"
            subtitle="Today"
          />
        </div>
      </div>

      {/* Consultation Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Consultations"
            value={data.overview.totalConsultations}
            icon={Phone}
            color="bg-indigo-600"
            subtitle="All time"
          />
          <StatCard
            title="Recent Consultations"
            value={data.overview.recentConsultations}
            icon={TrendingUp}
            color="bg-teal-600"
            subtitle="Last 30 days"
          />
          <StatCard
            title="Weekly Consultations"
            value={data.overview.weeklyConsultations}
            icon={Calendar}
            color="bg-pink-600"
            subtitle="Last 7 days"
          />
          <StatCard
            title="Today's Consultations"
            value={data.overview.todayConsultations}
            icon={Users}
            color="bg-cyan-600"
            subtitle="Today"
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Completion Time</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {data.overview.avgCompletionTime}
            </div>
            <p className="text-gray-600">Days</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Efficiency</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {Math.round(data.productionStats.avgProduction)}%
            </div>
            <p className="text-gray-600">Average Progress</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }: any) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Department */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consultation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations by Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultations by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={consultationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }: any) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {consultationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Consultations by Type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultations by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consultationTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82CA9D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
