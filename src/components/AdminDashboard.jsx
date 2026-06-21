import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ✨ Ambient Animated Background ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
    <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/5 blur-[150px] animate-pulse" style={{ animationDuration: '9s' }} />
    <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-red-500/10 blur-[150px] animate-pulse" style={{ animationDuration: '11s' }} />
  </div>
);

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
    navigate('/');
  };

  // --- 🪄 DEMO MAGIC: Optimistic UI Status Update ---
  const handleStatusChange = async (id, newStatus) => {
    // 1. Optimistic UI update
    setComplaints(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      )
    );

    // 2. Send the real update to your Spring Boot database
    try {
      const response = await fetch(`https://campusvoice-backend-ppgp.onrender.com/api/complaints/${id}/status?status=${newStatus}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Server failed to update status');
      }
      console.log(`Database successfully updated: ${id} is now ${newStatus}`);
    } catch (error) {
      console.error('Status Update Error:', error);
      alert('Failed to save status to the database. Ensure your backend is updated and running.');
    }
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
      case 'URGENT': return 'text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
      default: return 'text-green-400 bg-green-500/10 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-red-500/30 relative overflow-hidden pb-20">
      <AnimatedBackground />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* --- Top Navigation --- */}
      <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 transition-transform cursor-pointer">
            <i className="fas fa-shield-alt text-white text-xl"></i>
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white leading-tight">Master Admin</h1>
            <p className="text-xs text-red-400 font-bold uppercase tracking-widest mt-0.5">System Control</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 text-zinc-400 hover:text-white transition-all flex items-center space-x-2 cursor-pointer group"
        >
          <span className="hidden md:inline text-sm font-bold">Logout</span>
          <i className="fas fa-sign-out-alt group-hover:text-red-400 transition-colors"></i>
        </button>
      </nav>

      {/* --- Main Dashboard --- */}
      <main className="max-w-7xl mx-auto p-6 space-y-10 relative z-10 mt-6">
        
        {/* --- Key Reports Top Section --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-xl hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Total Issues</p>
                <h3 className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <i className="fas fa-layer-group text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-xl hover:border-yellow-500/30 hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)] transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Pending Review</p>
                <h3 className="text-4xl font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">{stats.pending}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                <i className="fas fa-clock text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-xl hover:border-orange-500/30 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">In Progress</p>
                <h3 className="text-4xl font-black text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">{stats.inProgress}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <i className="fas fa-tools text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-xl hover:border-green-500/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Resolved</p>
                <h3 className="text-4xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">{stats.resolved}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <i className="fas fa-check-circle text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* --- Complaint Management View --- */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 flex items-center gap-3">
              <i className="fas fa-tasks text-red-500"></i> Complaint Management
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="relative">
                 <i className="fas fa-circle-notch fa-spin text-5xl text-red-500 opacity-20"></i>
                 <i className="fas fa-circle-notch fa-spin text-5xl text-red-500 absolute top-0 left-0 animate-ping"></i>
               </div>
            </div>
          ) : (
            <div className="space-y-5">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col lg:flex-row gap-6 items-start lg:items-center relative overflow-hidden group">
                  
                  {/* Subtle left border glow on hover */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Left Data */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-bold bg-white/5 text-orange-400 px-3 py-1.5 rounded-lg border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                        {complaint.trackingId}
                      </span>
                      <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${getPriorityStyle(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-white group-hover:text-red-400 transition-colors leading-snug">
                      {complaint.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                      {complaint.description}
                    </p>
                    
                    <div className="text-xs font-bold text-zinc-500 flex flex-wrap gap-4 pt-2">
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5"><i className="fas fa-folder mr-1.5 text-zinc-400"></i> {complaint.category}</span>
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5"><i className="fas fa-user mr-1.5 text-zinc-400"></i> {complaint.anonymous ? 'Anonymous' : complaint.creatorId}</span>
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5"><i className="fas fa-calendar mr-1.5 text-zinc-400"></i> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="w-full lg:w-auto flex flex-row lg:flex-col gap-4 items-center lg:items-end border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0 lg:pl-6">
                    
                    {/* Status Dropdown */}
                    <div className="relative w-full lg:w-48 group/dropdown">
                      <select 
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        className={`w-full appearance-none bg-[#0B0F19] border rounded-xl py-3 px-4 text-sm font-black uppercase tracking-wider cursor-pointer focus:outline-none transition-all shadow-inner
                          ${complaint.status === 'PENDING' ? 'border-yellow-500/50 text-yellow-500 hover:border-yellow-400' : ''}
                          ${complaint.status === 'IN_PROGRESS' ? 'border-orange-500/50 text-orange-400 hover:border-orange-400' : ''}
                          ${complaint.status === 'RESOLVED' ? 'border-green-500/50 text-green-400 hover:border-green-400' : ''}
                        `}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-50 group-hover/dropdown:opacity-100 transition-opacity"></i>
                    </div>

                    <button className="px-5 py-3 w-full lg:w-48 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-zinc-300 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                      <i className="fas fa-pen"></i>
                      <span>Add Admin Note</span>
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