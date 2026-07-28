import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
          <Clock className="w-3 h-3" />
          Pending Action
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide bg-[#E3F2FD] text-[#0D47A1] border border-[#BBDEFB]">
          <RefreshCw className="w-3 h-3" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
          <CheckCircle2 className="w-3 h-3" />
          Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-300">
          {status}
        </span>
      );
  }
};

export default StatusBadge;
