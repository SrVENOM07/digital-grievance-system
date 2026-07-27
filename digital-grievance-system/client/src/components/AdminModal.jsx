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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100">Update Grievance Status</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {grievance._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grievance Summary */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs">
            <p className="text-slate-200 font-medium mb-1">{grievance.title}</p>
            <p className="text-slate-400 line-clamp-2">{grievance.description}</p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Status <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Pending', 'In Progress', 'Resolved'].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                    status === st
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Remarks / Action Notes
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add official resolution notes or status updates for the user..."
              className="w-full text-xs glass-input rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Changes</span>
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
