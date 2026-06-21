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

const PublicFeed = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- Fetch Public Data ---
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch('https://campusvoice-backend-ppgp.onrender.com/api/complaints');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // Filter ONLY public complaints and sort by upvotes (Trending)
        const publicIssues = data
          .filter(c => c.public === true || c.isPublic === true)
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
          
        setComplaints(publicIssues);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // --- Optimistic Upvote Handler ---
  const handleUpvote = async (id) => {
    // 1. Instantly update UI for that snappy feel
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, upvotes: (c.upvotes || 0) + 1, hasUpvoted: true } : c
    ));

    // 2. Silently tell the backend
    try {
      await fetch(`https://campusvoice-backend-ppgp.onrender.com/api/complaints/${id}/upvote`, {
        method: 'PATCH'
      });
    } catch (error) {
      console.error("Upvote failed to save", error);
    }
  };

  // --- Filtering Logic ---
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // 🎨 Deep Dark Background matching the ecosystem
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-orange-500/30 pb-20 relative overflow-hidden">
      <AnimatedBackground />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <i className="fas fa-bullhorn"></i>
          </div>
          <span className="font-extrabold text-xl tracking-tight">CampusVoice</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 text-zinc-400 hover:text-white transition-all flex items-center space-x-2 cursor-pointer group"
        >
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span className="text-sm font-bold">Dashboard</span>
        </button>
      </nav>

      {/* --- Header & Search --- */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center space-y-6 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">Feed</span>
        </h1>
        <p className="text-zinc-400 font-medium max-w-xl mx-auto text-lg">
          Discover, upvote, and support issues raised by your peers. Higher upvotes get prioritized by the administration.
        </p>

        {/* ✨ Upgraded Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mt-10">
          <div className="relative flex-1 group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Search trending issues..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111827]/80 backdrop-blur-md border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500 font-medium"
            />
          </div>
          <div className="relative w-full md:w-48 group">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#111827]/80 backdrop-blur-md border border-white/10 rounded-xl py-3.5 pl-4 pr-10 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all appearance-none cursor-pointer font-medium text-white"
            >
              <option value="All">All Categories</option>
              <option value="IT">💻 IT & Network</option>
              <option value="Maintenance">🛠️ Maintenance</option>
              <option value="Office">🏢 Admin & Office</option>
            </select>
            <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-focus-within:text-orange-500 transition-colors"></i>
          </div>
        </div>
      </header>

      {/* --- Feed Grid --- */}
      <main className="max-w-4xl mx-auto px-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <i className="fas fa-circle-notch fa-spin text-5xl text-orange-500 opacity-20"></i>
              <i className="fas fa-circle-notch fa-spin text-5xl text-orange-500 absolute top-0 left-0 animate-ping"></i>
            </div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
            <i className="fas fa-ghost text-5xl mb-4 text-zinc-600"></i>
            <h3 className="text-2xl font-bold text-white mb-2">No Issues Found</h3>
            <p className="text-zinc-400">Be the first to submit a public complaint to the community feed.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 md:p-8 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] transition-all duration-300 group flex gap-6 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle left border glow on hover */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Upvote Column */}
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => !complaint.hasUpvoted && handleUpvote(complaint.id)}
                    disabled={complaint.hasUpvoted}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      complaint.hasUpvoted 
                      ? 'bg-gradient-to-t from-orange-600 to-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] border-0 scale-105' 
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-orange-400 border border-white/10 shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <i className="fas fa-arrow-up text-xl"></i>
                  </button>
                  <span className={`font-extrabold text-lg ${complaint.hasUpvoted ? 'text-orange-400' : 'text-zinc-300'}`}>
                    {complaint.upvotes || 0}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2 items-center text-xs font-black uppercase tracking-wider">
                    <span className="text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                      {complaint.category}
                    </span>
                    <span className={`px-3 py-1.5 rounded-md border shadow-sm ${
                      complaint.status === 'RESOLVED' ? 'text-green-400 border-green-500/30 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 
                      complaint.status === 'IN_PROGRESS' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 
                      'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_10px_rgba(250,204,21,0.1)]'
                    }`}>
                      {complaint.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {complaint.title}
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed font-medium line-clamp-3">
                    {complaint.description}
                  </p>
                  
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-3 text-sm text-zinc-500 font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <i className={`fas ${complaint.anonymous || complaint.isAnonymous ? 'fa-user-secret' : 'fa-user'} text-xs text-zinc-400`}></i>
                      </div>
                      <span className="text-zinc-300">{complaint.anonymous || complaint.isAnonymous ? 'Anonymous Student' : complaint.creatorId}</span>
                    </div>
                    <span>•</span>
                    <span><i className="fas fa-calendar-alt mr-1"></i> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicFeed;