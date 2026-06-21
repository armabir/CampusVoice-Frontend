import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleLogout = () => {
    // Clear tokens/session logic here
    navigate('/auth');
  };

  // Helper for dynamic status badge colors (handles backend Enums like IN_PROGRESS)
  const getStatusStyle = (status) => {
    const normalized = status?.toUpperCase().replace('_', ' ');
    switch (normalized) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'IN PROGRESS':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  // Helper to format the backend ISO date string
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans selection:bg-orange-500/30">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* --- Top Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <i className="fas fa-user text-white"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Student Portal</h1>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Dashboard</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="text-zinc-400 hover:text-orange-500 transition-colors flex items-center space-x-2"
        >
          <span className="hidden md:inline text-sm font-medium">Logout</span>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header & Action Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
          <div>
            <h2 className="text-3xl font-bold">My Complaints</h2>
            <p className="text-zinc-400 mt-1">Track and manage your university support requests.</p>
          </div>
          <button 
            onClick={() => navigate('/submit')}
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
          >
            <i className="fas fa-plus"></i>
            <span>Submit New Complaint</span>
          </button>
        </div>

        {/* Complaints Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusStyle(complaint.status)}`}>
                      {complaint.status?.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      {formatDate(complaint.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {complaint.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-4">
                    <i className="fas fa-tag text-xs"></i>
                    <span>{complaint.category}</span>
                  </div>
                </div>

                {/* Admin Messages / Updates */}
                <div className={`mt-4 pt-4 border-t border-white/10 ${complaint.adminNote ? 'block' : 'hidden'}`}>
                  <div className="flex items-start space-x-3 bg-zinc-800/50 p-3 rounded-xl border border-white/5">
                    <i className="fas fa-comment-dots text-orange-500 mt-1"></i>
                    <div>
                      <p className="text-xs font-bold text-zinc-300 mb-1">Admin Update</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {complaint.adminNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* No updates fallback state */}
                {!complaint.adminNote && (
                   <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-zinc-600 text-sm">
                     <i className="fas fa-clock mr-2"></i>
                     Awaiting response...
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