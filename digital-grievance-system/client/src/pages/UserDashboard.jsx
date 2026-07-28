import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GrievanceCard from '../components/GrievanceCard';
import API from '../services/api';
import { PlusCircle, FileText, Image as ImageIcon, Send, AlertCircle, CheckCircle2, RefreshCw, X } from 'lucide-react';

const UserDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  const categories = ['Infrastructure', 'Academic', 'Administrative', 'Hostel', 'Sanitation', 'Other'];

  const fetchMyGrievances = async () => {
    setLoading(true);
    try {
      const res = await API.get('/grievances/my');
      if (res.data.success) {
        setGrievances(res.data.grievances);
      }
    } catch (err) {
      console.error('Fetch grievances error:', err);
      setError('Failed to load your grievances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGrievances();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, JPEG, WEBP)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormSuccess('');

    if (!title.trim()) {
      setError('Please provide a title for your grievance');
      return;
    }

    if (!description.trim()) {
      setError('Please describe your grievance in detail');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await API.post('/grievances', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormSuccess('Grievance submitted successfully!');
        setTitle('');
        setDescription('');
        setCategory('Infrastructure');
        removeSelectedFile();
        fetchMyGrievances(); // Refresh list
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Error submitting grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    if (activeFilter === 'ALL') return true;
    return g.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-gray-800">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-2 px-4 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center text-xs text-gray-500 font-medium space-x-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#0F4C81] font-semibold">Citizen Dashboard</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Submit New Grievance Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="gov-card p-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 mb-5">
              <div className="p-2 rounded-sm bg-[#E3F2FD] text-[#0F4C81]">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">File a Complaint</h2>
                <p className="text-xs text-gray-500 font-medium">Submit official grievance details</p>
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-xs bg-[#FDEDED] border border-[#F5C2C7] text-[#842029] rounded-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 p-3 text-xs bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] rounded-sm mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Grievance Category <span className="text-red-500">*</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm gov-input px-3 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject / Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of the issue"
                  className="w-full text-sm gov-input px-3 py-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide full details, location, and context..."
                  className="w-full text-sm gov-input px-3 py-2 resize-none"
                  required
                />
              </div>

              {/* Image Attachment Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Supporting Document (Optional)</label>
                
                {previewUrl ? (
                  <div className="relative border border-gray-300 bg-gray-50 p-2 flex items-center gap-3 rounded-sm">
                    <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover border border-gray-300 rounded-sm" />
                    <div className="flex-1 truncate">
                      <p className="text-xs font-medium text-gray-700 truncate">{selectedFile?.name}</p>
                      <p className="text-[10px] text-gray-500">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100 rounded-sm p-3 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-xs text-gray-600 font-medium">Upload Image Evidence</span>
                    <span className="text-[10px] text-gray-500">JPG, PNG (Max 5MB)</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-sm gov-button-primary flex items-center justify-center space-x-2 mt-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Submitted Grievances List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="gov-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F4C81]">Complaint History</h2>
              <p className="text-xs text-gray-500 font-medium">Track your submitted applications</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 text-sm bg-gray-100 p-1 rounded-sm border border-gray-200">
              {['ALL', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${
                    activeFilter === tab
                      ? 'bg-white text-[#0F4C81] shadow-sm border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grievance List Content */}
          {loading ? (
            <div className="gov-card p-12 text-center flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#0F4C81] animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading records...</p>
            </div>
          ) : filteredGrievances.length === 0 ? (
            <div className="gov-card p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-700">No Records Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                {activeFilter === 'ALL'
                  ? 'You have not submitted any applications yet.'
                  : `No applications currently match the status "${activeFilter}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGrievances.map((grievance) => (
                <GrievanceCard key={grievance._id} grievance={grievance} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
