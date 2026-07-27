import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GrievanceCard from '../components/GrievanceCard';
import API from '../services/api';
import { PlusCircle, FileText, Image as ImageIcon, Send, AlertCircle, CheckCircle2, Filter, RefreshCw, X } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Submit New Grievance Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Submit New Grievance</h2>
                <p className="text-xs text-slate-400">File an official report with institution administration</p>
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs glass-input rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none bg-slate-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Grievance Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary (e.g. Water Leakage in Block B)"
                  className="w-full text-xs glass-input rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about the issue..."
                  className="w-full text-xs glass-input rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Image Attachment Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attach Evidence Photo (Optional)</label>
                
                {previewUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 p-2 flex items-center gap-3">
                    <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-800" />
                    <div className="flex-1 truncate">
                      <p className="text-xs font-medium text-slate-200 truncate">{selectedFile?.name}</p>
                      <p className="text-[10px] text-slate-400">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/30 hover:bg-slate-900/60 transition-all group">
                    <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors mb-1" />
                    <span className="text-xs text-slate-300 font-medium">Click to select photo</span>
                    <span className="text-[10px] text-slate-500">JPG, PNG, WEBP up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Uploading & Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Grievance</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Submitted Grievances List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <h2 className="text-lg font-extrabold text-slate-100">My Grievances</h2>
              <p className="text-xs text-slate-400">Track real-time status updates and admin responses</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['ALL', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === tab
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grievance List Content */}
          {loading ? (
            <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-xs font-medium text-slate-400">Fetching your submitted grievances...</p>
            </div>
          ) : filteredGrievances.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No grievances found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeFilter === 'ALL'
                  ? 'You haven\'t submitted any grievances yet. Fill out the form to submit one.'
                  : `No grievances matching the status "${activeFilter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
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
