import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Users, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { Consultation, ConsultationStatus, ConfirmationStatus } from '../types';
import { consultationApi, adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ConsultationsView() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedConsultation, setExpandedConsultation] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState<'all' | ConsultationStatus>('all');
  const [smsTo, setSmsTo] = useState<string>('');
  const [smsMessage, setSmsMessage] = useState<string>('Thank you for calling us. Visit https://www.afterlife.org.in');
  const [smsSending, setSmsSending] = useState<boolean>(false);
  const [smsResult, setSmsResult] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationApi.getConsultations();
      setConsultations(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch consultations';
      setError(errorMessage);
      console.error('Consultation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ConsultationStatus, notes?: string) => {
    try {
      setUpdating(true);
      const updatedConsultation = await consultationApi.updateStatus(id, status, notes);
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === id ? updatedConsultation : consultation
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const updateConfirmationStatus = async (id: string, confirmation_status: ConfirmationStatus) => {
    try {
      setUpdating(true);
      const updatedConsultation = await consultationApi.updateConfirmationStatus(id, confirmation_status);
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === id ? updatedConsultation : consultation
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update confirmation status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfirmationColor = (status: ConfirmationStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Calculate metrics
  const metrics = {
    total: consultations.length,
    pending: consultations.filter(c => c.status === 'pending').length,
    scheduled: consultations.filter(c => c.status === 'scheduled').length,
    completed: consultations.filter(c => c.status === 'completed').length,
    cancelled: consultations.filter(c => c.status === 'cancelled').length,
  };

  const filteredConsultations = filter === 'all' 
    ? consultations 
    : consultations.filter(c => c.status === filter);

  const toggleExpand = (consultationId: string) => {
    setExpandedConsultation(expandedConsultation === consultationId ? null : consultationId);
    setSmsResult(null);
    // prefill phone in UI but keep manual editing and country code responsibility
    const current = consultations.find(c => c._id === consultationId);
    if (current) {
      setSmsTo('');
      setSmsMessage('Thank you for calling us. Visit https://www.afterlife.org.in');
    }
  };

  const sendSms = async () => {
    try {
      setSmsSending(true);
      setSmsResult(null);
      if (!smsTo || !smsTo.startsWith('+')) {
        setSmsResult('Enter recipient in E.164 format, e.g. +9198XXXXXXXX');
        return;
      }
      const resp = await adminApi.sendSms(smsTo.trim(), smsMessage?.trim() || undefined);
      setSmsResult(`Sent (sid: ${resp.sid}, status: ${resp.status})`);
    } catch (e: any) {
      setSmsResult(e?.message || 'Failed to send SMS');
    } finally {
      setSmsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <XCircle className="w-5 h-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        
        <button
          onClick={fetchConsultations}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Refresh Data
        </button>
      </div> */}

      
      {/* Consultations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Consultations</h3>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | ConsultationStatus)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredConsultations.map((consultation) => (
            <div
              key={consultation._id}
              className={`transition-all duration-200 ${
                expandedConsultation === consultation._id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              {/* Consultation Summary */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(consultation._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-base font-semibold text-gray-900">{consultation.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                            <span className="ml-1">{consultation.status}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getConfirmationColor(consultation.confirmation_status)}`}>
                            {consultation.confirmation_status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{consultation.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{consultation.zip_code}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{consultation.preferred_date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{consultation.preferred_time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {consultation.closet_type}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {consultation.number_of_spaces} spaces
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {consultation.consultation_type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    {expandedConsultation === consultation._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedConsultation === consultation._id && (
                <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Customer Information</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                          <p className="text-sm text-gray-900">{consultation.name}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                          <p className="text-sm text-gray-900">{consultation.phone}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                          <p className="text-sm text-gray-900">{consultation.address}</p>
                          <p className="text-xs text-gray-600 mt-1">{consultation.zip_code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Project Details</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Closet Type</label>
                          <p className="text-sm text-gray-900">{consultation.closet_type}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Number of Spaces</label>
                          <p className="text-sm text-gray-900">{consultation.number_of_spaces}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Consultation Type</label>
                          <p className="text-sm text-gray-900">{consultation.consultation_type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Schedule & Status */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Schedule & Status</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Preferred Date & Time</label>
                          <p className="text-sm text-gray-900">{consultation.preferred_date} at {consultation.preferred_time}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Phone Source</label>
                          <p className="text-sm text-gray-900">{consultation.phone_source}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Created Date</label>
                          <p className="text-sm text-gray-900">{new Date(consultation.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Status Controls */}
                      <div className="pt-4 border-t border-gray-200">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Update Status</h6>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Consultation Status</label>
                            <select
                              value={consultation.status}
                              onChange={(e) => updateStatus(consultation._id, e.target.value as ConsultationStatus)}
                              disabled={updating}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Confirmation Status</label>
                            <select
                              value={consultation.confirmation_status}
                              onChange={(e) => updateConfirmationStatus(consultation._id, e.target.value as ConfirmationStatus)}
                              disabled={updating}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="pending">Confirmation Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Send SMS (Overall only) */}
                      {user?.department === 'overall' && (
                        <div className="pt-4 border-t border-gray-200">
                          <h6 className="text-sm font-medium text-gray-700 mb-3">Send SMS</h6>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">To (E.164 with country code)</label>
                              <input
                                type="text"
                                value={smsTo}
                                onChange={(e) => setSmsTo(e.target.value)}
                                placeholder="+9198XXXXXXXX"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Message (optional)</label>
                              <textarea
                                value={smsMessage}
                                onChange={(e) => setSmsMessage(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                              <p className="text-xs text-gray-500 mt-1">Defaults to a thank you with link if empty.</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={sendSms}
                                disabled={smsSending}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${smsSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                              >
                                {smsSending ? 'Sending...' : 'Send SMS'}
                              </button>
                              {smsResult && (
                                <span className="text-sm text-gray-700">{smsResult}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredConsultations.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">No consultations found</p>
              <p className="text-gray-600">No consultations match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}