import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const AdminModal = ({ grievance, isOpen, onClose, onSave }) => {
  const [status, setStatus] = useState('Pending');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (grievance) {
      setStatus(grievance.status || 'Pending');
      setRemarks(grievance.adminRemarks || '');
      setError('');
    }
  }, [grievance]);

  if (!isOpen || !grievance) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const res = await onSave(grievance._id, { status, adminRemarks: remarks });
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Failed to update grievance status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-sm p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F4C81]">Update Application Status</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">Reference ID: {grievance._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm bg-[#FDEDED] border border-[#F5C2C7] text-[#842029] rounded-sm mb-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Grievance Summary */}
          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 text-sm">
            <p className="text-gray-900 font-bold mb-1">{grievance.title}</p>
            <p className="text-gray-600 line-clamp-2">{grievance.description}</p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Action / Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Pending', 'In Progress', 'Resolved'].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 text-sm font-medium rounded-sm border transition-colors ${
                    status === st
                      ? 'bg-[#E3F2FD] border-[#0F4C81] text-[#0F4C81]'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Official Remarks / Resolution Notes
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add official resolution notes or status updates for the citizen..."
              className="w-full text-sm gov-input p-3 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 rounded-sm border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F4C81] hover:bg-[#0a355c] rounded-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Update Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
