import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GrievanceCard from '../components/GrievanceCard';
import AdminModal from '../components/AdminModal';
import API from '../services/api';
import { Shield, Clock, RefreshCw, CheckCircle2, FileText, Search, Filter, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Shield className="w-3.5 h-3.5" /> Administrative Control Panel
            </div>
            <h1 className="text-2xl font-black text-slate-100">Grievance Management Dashboard</h1>
            <p className="text-xs text-slate-400">Overview, real-time status management and resolution tracking</p>
          </div>

          <button
            onClick={fetchAllGrievances}
            className="self-start md:self-auto flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</p>
              <h3 className="text-2xl font-black text-slate-100 mt-1">{stats.total}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pending Action</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{stats.pending}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-black text-blue-400 mt-1">{stats.inProgress}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolved</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.resolved}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or submitter email..."
              className="w-full text-xs glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs glass-input rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none bg-slate-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs glass-input rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none bg-slate-900"
            >
              {['ALL', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-slate-100">
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Grievances Cards Grid */}
        {loading ? (
          <div className="glass-card rounded-3xl p-16 text-center flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-medium text-slate-400">Loading grievances from database...</p>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center space-y-3 border border-slate-800/80">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No grievances match criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
