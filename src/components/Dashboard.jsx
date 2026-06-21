import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ✨ Ambient Animated Background ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
    <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[150px] animate-pulse" style={{ animationDuration: '9s' }} />
    <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-orange-500/10 blur-[150px] animate-pulse" style={{ animationDuration: '11s' }} />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from the Spring Boot API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('https://campusvoice-backend-ppgp.onrender.com/api/complaints');
        if (!response.ok) throw new Error('Network response was not ok');
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

  // Glowing Status Badges
  const getStatusStyle = (status) => {
    const normalized = status?.toUpperCase().replace('_', ' ');
    switch (normalized) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
      case 'IN PROGRESS':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      case 'RESOLVED':
        return 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-orange-500/30 relative overflow-hidden pb-20">
      <AnimatedBackground />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* --- Top Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform cursor-pointer">
            <i className="fas fa-user text-white text-xl"></i>
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-white tracking-tight">ARM ABIR HASAN</h1>
            <p className="text-xs text-orange-400 font-bold tracking-widest uppercase mt-0.5">
              ID: 2023100000176 <span className="text-zinc-600 mx-1">•</span> Student
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 text-zinc-400 hover:text-white transition-all flex items-center space-x-2 cursor-pointer group"
        >
          <span className="hidden md:inline text-sm font-bold">Logout</span>
          <i className="fas fa-sign-out-alt group-hover:text-orange-400 transition-colors"></i>
        </button>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="max-w-6xl mx-auto p-6 space-y-10 relative z-10 mt-6">
        
        {/* Header & Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">
              My Complaints
            </h2>
            <p className="text-zinc-400 font-medium">Track and manage your university support requests in real-time.</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <button 
              onClick={() => navigate('/feed')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-orange-500/50 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fas fa-globe text-orange-500"></i>
              <span>Public Feed</span>
            </button>

            <button 
              onClick={() => navigate('/submit')}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <i className="fas fa-plus"></i>
              <span>Submit Request</span>
            </button>
          </div>
        </div>

        {/* Complaints Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <i className="fas fa-circle-notch fa-spin text-5xl text-orange-500 opacity-20"></i>
              <i className="fas fa-circle-notch fa-spin text-5xl text-orange-500 absolute top-0 left-0 animate-ping"></i>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
             <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
               <i className="fas fa-inbox text-3xl text-orange-400"></i>
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">No Complaints Yet</h3>
             <p className="text-zinc-400">You haven't submitted any issues. Your dashboard is clear!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 flex flex-col justify-between hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle top border glow on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex justify-between items-start mb-5">
                    <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md border ${getStatusStyle(complaint.status)}`}>
                      {complaint.status?.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-zinc-500 font-bold bg-white/5 px-2 py-1 rounded">
                      {formatDate(complaint.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-extrabold mb-2 text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                    {complaint.title}
                  </h3>
                  
                  {/* ✨ NEW: Truncated Description */}
                  <p className="text-sm text-zinc-400 mb-5 line-clamp-2 leading-relaxed font-medium">
                    {complaint.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs font-bold tracking-wider text-zinc-400 uppercase mb-4 bg-white/5 inline-flex px-3 py-1.5 rounded-lg border border-white/5">
                    <i className="fas fa-tag text-orange-500"></i>
                    <span>{complaint.category}</span>
                  </div>
                </div>

                {/* Admin Messages / Updates */}
                <div className={`mt-auto pt-5 border-t border-white/10 ${complaint.adminNote ? 'block' : 'hidden'}`}>
                  <div className="flex items-start space-x-3 bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-orange-500" />
                    <i className="fas fa-comment-dots text-orange-500 mt-0.5 text-lg"></i>
                    <div>
                      <p className="text-xs font-black text-orange-400 mb-1 uppercase tracking-wider">Admin Update</p>
                      <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                        {complaint.adminNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* No updates fallback state */}
                {!complaint.adminNote && (
                   <div className="mt-auto pt-5 border-t border-white/10 flex items-center text-zinc-500 text-sm font-semibold">
                     <i className="fas fa-clock mr-2 text-zinc-600"></i>
                     Awaiting administrative review...
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;