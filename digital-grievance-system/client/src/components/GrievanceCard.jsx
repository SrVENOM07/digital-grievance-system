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
    <div className="gov-card flex flex-col justify-between hover:shadow-md transition-shadow">
      
      {/* Top Banner (Header) */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-gray-500 block mb-1">ID: {grievance._id.slice(-8).toUpperCase()}</span>
          <h3 className="text-sm font-bold text-[#0F4C81] leading-snug break-words">
            {grievance.title}
          </h3>
        </div>
        <div className="shrink-0">
          <StatusBadge status={grievance.status} />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col space-y-4">
        {/* Metadata: Category & Date */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 border-b border-gray-100 pb-3">
          <span className="inline-flex items-center gap-1 font-medium bg-gray-100 px-2 py-0.5 rounded-sm">
            <Tag className="w-3.5 h-3.5 text-gray-500" />
            {grievance.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            {formattedDate}
          </span>
        </div>

        {/* User Info (For Admin View) */}
        {isAdmin && grievance.userId && (
          <div className="bg-[#F5F7FA] p-3 rounded-sm border border-gray-200 text-xs space-y-1.5 shadow-sm">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 border-b border-gray-200 pb-1">Applicant Details</div>
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <User className="w-3.5 h-3.5 text-[#0F4C81]" />
              <span>{grievance.userId.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 text-[11px]">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" /> {grievance.userId.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" /> {grievance.userId.phone}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">Description</span>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {grievance.description}
          </p>
        </div>

        {/* Attached Image Preview */}
        {grievance.imageUrl && (
          <div className="mt-2">
            <button
              onClick={() => setShowImageModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C81] hover:text-[#0a355c] bg-[#E3F2FD] hover:bg-[#BBDEFB] px-3 py-1.5 rounded-sm transition-colors border border-[#90CAF9]"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              View Attachment
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Admin Remarks */}
        {grievance.adminRemarks && (
          <div className="bg-[#E8F5E9] border-l-4 border-[#138808] rounded-r-sm p-3 text-xs mt-auto">
            <div className="flex items-center gap-1.5 text-[#138808] font-bold mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Official Remarks:
            </div>
            <p className="text-gray-800 leading-relaxed">
              {grievance.adminRemarks}
            </p>
          </div>
        )}
      </div>

      {/* Admin Action Button */}
      {isAdmin && onUpdateStatus && (
        <div className="bg-gray-50 p-3 border-t border-gray-200">
          <button
            onClick={() => onUpdateStatus(grievance)}
            className="w-full py-2 px-3 text-xs font-bold text-[#0F4C81] bg-white border border-[#0F4C81] hover:bg-[#0F4C81] hover:text-white rounded-sm transition-colors"
          >
            Update Action Status
          </button>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-white rounded-sm p-4 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
              <h4 className="text-sm font-bold text-[#0F4C81]">Document Attachment</h4>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-sm hover:bg-gray-200 transition-colors text-xs font-semibold"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center rounded-sm bg-gray-50 border border-gray-200 p-2">
              <img
                src={grievance.imageUrl}
                alt="Grievance attachment"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceCard;
