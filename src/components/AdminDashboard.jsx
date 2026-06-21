import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('https://campusvoice-backend-ppgp.onrender.com/api/complaints');
        if (!response.ok) throw new Error('Network response failed');
        const data = await response.json();
        
        // Sort newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComplaints(sortedData);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('campusVoiceUser');
    navigate('/auth');
  };

  // --- 🪄 DEMO MAGIC: Optimistic UI Status Update ---
  const handleStatusChange = (id, newStatus) => {
    // We update the frontend state immediately to look like it worked!
    setComplaints(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      )
    );
    // Optional: Pop a subtle success toast here if you have one!
    console.log(`Demo: Status for ${id} changed to ${newStatus}`);
  };

  // --- Calculated Key Reports ---
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  };

  // Helper for dynamic badge colors
  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-orange-500/30">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* --- Top Navigation --- */}
      <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <i className="fas fa-shield-alt text-white text-xl"></i>
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white">Master Admin</h1>
            <p className="text-xs text-red-400 font-bold uppercase tracking-widest">System Control</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition-all flex items-center space-x-2 cursor-pointer"
        >
          <span className="text-sm font-bold">Logout</span>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </nav>

      {/* --- Main Dashboard --- */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* --- Key Reports Top Section --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-semibold mb-1">Total Issues</p>
                <h3 className="text-3xl font-extrabold text-white">{stats.total}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><i className="fas fa-layer-group"></i></div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-semibold mb-1">Pending Review</p>
                <h3 className="text-3xl font-extrabold text-yellow-500">{stats.pending}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center"><i className="fas fa-clock"></i></div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-semibold mb-1">In Progress</p>
                <h3 className="text-3xl font-extrabold text-orange-400">{stats.inProgress}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center"><i className="fas fa-tools"></i></div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-semibold mb-1">Resolved</p>
                <h3 className="text-3xl font-extrabold text-green-400">{stats.resolved}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><i className="fas fa-check-circle"></i></div>
            </div>
          </div>
        </div>

        {/* --- Complaint Management View --- */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-tasks text-orange-500"></i> Complaint Management
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-20"><i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i></div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center">
                  
                  {/* Left Data */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-white/5">
                        {complaint.trackingId}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityStyle(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{complaint.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-1">{complaint.description}</p>
                    <div className="text-xs text-zinc-500 flex gap-4 font-medium">
                      <span><i className="fas fa-folder mr-1"></i> {complaint.category}</span>
                      <span><i className="fas fa-user mr-1"></i> {complaint.anonymous ? 'Anonymous' : complaint.creatorId}</span>
                      <span><i className="fas fa-calendar mr-1"></i> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 items-end">
                    {/* Status Dropdown */}
                    <div className="relative w-full md:w-48">
                      <select 
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        className={`w-full appearance-none bg-zinc-900 border rounded-xl py-2 px-4 text-sm font-bold cursor-pointer focus:outline-none transition-colors
                          ${complaint.status === 'PENDING' ? 'border-yellow-500/50 text-yellow-500' : ''}
                          ${complaint.status === 'IN_PROGRESS' ? 'border-orange-500/50 text-orange-400' : ''}
                          ${complaint.status === 'RESOLVED' ? 'border-green-500/50 text-green-400' : ''}
                        `}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-50"></i>
                    </div>

                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-zinc-300 transition-colors w-full md:w-auto">
                      Add Note
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;