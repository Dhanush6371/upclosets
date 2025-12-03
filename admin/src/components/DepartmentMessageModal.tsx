import { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface DepartmentMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  fromDepartment: string;
  toDepartment: string;
  orderId: string;
}

export default function DepartmentMessageModal({
  isOpen,
  onClose,
  onSend,
  fromDepartment,
  toDepartment,
  orderId
}: DepartmentMessageModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await onSend(message.trim());
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-semibold">Send Message</h3>
                <p className="text-blue-100 text-sm">Order: {orderId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">From:</span>
              <span className="text-sm font-semibold text-blue-600">
                {getDepartmentName(fromDepartment)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">To:</span>
              <span className="text-sm font-semibold text-green-600">
                {getDepartmentName(toDepartment)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Optional: Add any notes or instructions for the next department..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Press Ctrl+Enter to send quickly
              </p>
              <span className="text-xs text-gray-400">
                {message.length}/500
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Move to Next Department</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



