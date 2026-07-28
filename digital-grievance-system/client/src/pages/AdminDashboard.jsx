import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GrievanceCard from '../components/GrievanceCard';
import AdminModal from '../components/AdminModal';
import API from '../services/api';
import { Shield, Clock, RefreshCw, CheckCircle2, FileText, Search, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['ALL', 'Infrastructure', 'Academic', 'Administrative', 'Hostel', 'Sanitation', 'Other'];

  const fetchAllGrievances = async () => {
    setLoading(true);
    try {
      const res = await API.get('/grievances/admin/all');
      if (res.data.success) {
        setGrievances(res.data.grievances);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Fetch all grievances error:', err);
      setError('Failed to fetch grievances from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGrievances();
  }, []);

  const handleOpenModal = (grievance) => {
    setSelectedGrievance(grievance);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async (id, updateData) => {
    try {
      const res = await API.put(`/grievances/${id}/status`, updateData);
      if (res.data.success) {
        fetchAllGrievances(); // Refresh real-time from DB
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error updating grievance'
      };
    }
  };

  // Filtered List Logic
  const filteredGrievances = grievances.filter((g) => {
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || g.category === categoryFilter;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      g.title.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query) ||
      (g.userId && g.userId.name.toLowerCase().includes(query)) ||
      (g.userId && g.userId.email.toLowerCase().includes(query));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-800 flex flex-col font-sans">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-2 px-4 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center text-xs text-gray-500 font-medium space-x-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#0F4C81] font-semibold">Administrative Dashboard</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase bg-[#E8F5E9] text-[#138808] border border-[#C8E6C9] mb-2">
              <Shield className="w-3 h-3" /> Nodal Officer Access
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0F4C81]">Grievance Management System</h1>
            <p className="text-sm text-gray-500 font-medium">Departmental overview and resolution tracking</p>
          </div>

          <button
            onClick={fetchAllGrievances}
            className="self-start md:self-auto flex items-center space-x-1.5 px-4 py-2 text-sm gov-button-secondary bg-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="gov-card p-5 border-l-4 border-l-[#0F4C81] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Received</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</h3>
            </div>
            <div className="p-2 bg-[#E3F2FD] rounded-full text-[#0F4C81]">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="gov-card p-5 border-l-4 border-l-[#D32F2F] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Pending</p>
              <h3 className="text-2xl font-bold text-[#D32F2F] mt-1">{stats.pending}</h3>
            </div>
            <div className="p-2 bg-[#FDEDED] rounded-full text-[#D32F2F]">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="gov-card p-5 border-l-4 border-l-[#FF9933] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">In Progress</p>
              <h3 className="text-2xl font-bold text-[#FF9933] mt-1">{stats.inProgress}</h3>
            </div>
            <div className="p-2 bg-[#FFF3E0] rounded-full text-[#FF9933]">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>

          <div className="gov-card p-5 border-l-4 border-l-[#138808] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Resolved</p>
              <h3 className="text-2xl font-bold text-[#138808] mt-1">{stats.resolved}</h3>
            </div>
            <div className="p-2 bg-[#E8F5E9] rounded-full text-[#138808]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="gov-card p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, applicant name, or subject..."
              className="w-full text-sm gov-input pl-9 pr-3 py-2"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-sm gov-input px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Department: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-sm gov-input px-3 py-2"
            >
              {['ALL', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm bg-[#FDEDED] border border-[#F5C2C7] text-[#842029] rounded-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Grievances List */}
        <div className="gov-card overflow-hidden">
          <div className="bg-[#0F4C81] px-6 py-3 border-b border-[#0F4C81]">
            <h2 className="text-white font-semibold text-sm">Grievance Records List</h2>
          </div>
          
          <div className="p-4 bg-gray-50">
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-6 h-6 text-[#0F4C81] animate-spin" />
                <p className="text-sm font-medium text-gray-500">Fetching official records...</p>
              </div>
            ) : filteredGrievances.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                <h3 className="text-sm font-bold text-gray-700">No Records Match Criteria</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredGrievances.map((grievance) => (
                  <GrievanceCard
                    key={grievance._id}
                    grievance={grievance}
                    isAdmin={true}
                    onUpdateStatus={handleOpenModal}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Status & Remarks Modal */}
        <AdminModal
          grievance={selectedGrievance}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStatus}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
