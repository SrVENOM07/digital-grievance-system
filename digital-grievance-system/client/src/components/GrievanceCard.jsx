import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Calendar, Tag, MessageSquare, Image as ImageIcon, User, Phone, Mail, ExternalLink } from 'lucide-react';

const GrievanceCard = ({ grievance, isAdmin = false, onUpdateStatus }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const formattedDate = new Date(grievance.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4">
      <div>
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-slate-100 leading-snug break-words">
            {grievance.title}
          </h3>
          <StatusBadge status={grievance.status} />
        </div>

        {/* Metadata: Category & Date */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md text-indigo-300 font-medium">
            <Tag className="w-3.5 h-3.5" />
            {grievance.category}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        {/* User Info (For Admin View) */}
        {isAdmin && grievance.userId && (
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs mb-3 space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{grievance.userId.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" /> {grievance.userId.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" /> {grievance.userId.phone}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/50 mb-3 whitespace-pre-wrap">
          {grievance.description}
        </p>

        {/* Attached Image Preview */}
        {grievance.imageUrl && (
          <div className="mb-3">
            <button
              onClick={() => setShowImageModal(true)}
              className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-all group"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              View Attachment
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Admin Remarks */}
        {grievance.adminRemarks && (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Admin Remarks:
            </div>
            <p className="text-slate-300 leading-relaxed italic">
              "{grievance.adminRemarks}"
            </p>
          </div>
        )}
      </div>

      {/* Admin Action Button */}
      {isAdmin && onUpdateStatus && (
        <div className="pt-3 border-t border-slate-800/60">
          <button
            onClick={() => onUpdateStatus(grievance)}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            Update Status & Remarks
          </button>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-slate-200">Attached Evidence</h4>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center rounded-xl bg-black">
              <img
                src={grievance.imageUrl}
                alt="Grievance attachment"
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceCard;
