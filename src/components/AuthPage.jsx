import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ✨ NEW: Ambient Animated Background ---
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
    <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
    <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-orange-500/15 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
  </div>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  // --- API Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login for:", formData.email);

    const email = formData.email.trim();

    // ==========================================
    // 🪄 DEMO MAGIC: HARDCODED ROUTES
    // ==========================================

    // 1. Admin Bypass check
    if (email === 'admin@seu.edu.bd' || email.endsWith('.admin@seu.edu.bd')) {
      console.log("Demo Admin Login!");
      localStorage.setItem('campusVoiceUser', JSON.stringify({
        role: 'ADMIN',
        name: 'Master Admin',
        email: email
      }));
      navigate('/admin-dashboard'); 
      return;
    }

    // 2. Student Bypass check
    const studentRegex = /^(\d+)@seu\.edu\.bd$/;
    const match = email.match(studentRegex);
    
    if (match) {
      const studentId = match[1]; 
      console.log("Demo Student Login!");
      
      localStorage.setItem('campusVoiceUser', JSON.stringify({
        role: 'STUDENT',
        name: 'ARM ABIR HASAN', 
        id: studentId, 
        email: email
      }));
      
      navigate('/dashboard');
      return;
    }
    // ==========================================

    // Real backend fetch fallback
    try {
      const response = await fetch(`https://campusvoice-backend-ppgp.onrender.com/api/users/search?email=${formData.email}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Login failed: ${errorText || "User not found!"}`);
        return;
      }

      const user = await response.json();
      
      if (user.password === formData.password) {
        localStorage.setItem('campusVoiceUser', JSON.stringify(user));
        navigate('/dashboard'); 
      } else {
        alert("Incorrect password!");
      }
      
    } catch (error) {
      alert("Network Error: Cannot connect to the server.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Attempting signup...");

    const payload = { 
      name: formData.name, 
      email: formData.email, 
      password: formData.password 
    };

    try {
      const response = await fetch('https://campusvoice-backend-ppgp.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Signup failed: ${errorText || "Email might already be in use."}`);
        return;
      }

      const newUser = await response.json();
      console.log("Signup successful!", newUser);
      alert("Account created successfully! Please sign in.");
      toggleMode(); 

    } catch (error) {
      console.error("Signup Error:", error.message);
      if (error.message === "Failed to fetch" || error.message.includes("Network Error")) {
        alert("Network Error: Cannot connect to the server.");
      } else {
        alert("An unexpected error occurred during signup.");
      }
    }
  };

  return (
    // 🎨 Deep Dark Background matching the Landing Page
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
      <AnimatedBackground />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* Main Glass Container with enhanced glow */}
      <div className="relative w-full max-w-4xl h-[600px] md:h-[500px] bg-[#111827]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* --- MOBILE VIEW (Stacked Toggle) --- */}
        <div className="md:hidden flex flex-col items-center justify-center w-full h-full p-8 space-y-6 transition-all duration-500">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form 
            onSubmit={isLogin ? handleLogin : handleSignup} 
            className="w-full space-y-4 flex flex-col"
          >
            {!isLogin && (
              <div className="relative group">
                <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
              </div>
            )}

            <div className="relative group">
              <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
            </div>

            <div className="relative group">
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all z-50 relative cursor-pointer mt-2">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-zinc-400 cursor-pointer hover:text-white font-medium" onClick={toggleMode}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </p>
        </div>

        {/* --- DESKTOP VIEW (Sliding Overlay) --- */}
        <div className="hidden md:flex w-full h-full relative">
          
          {/* Sign In Form (Anchored Left) */}
          <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out ${isLogin ? 'translate-x-0 opacity-100 z-20 pointer-events-auto' : 'translate-x-[100%] opacity-0 pointer-events-none'}`}>
            <div className="w-full max-w-sm">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">Sign In</h2>
              <p className="text-zinc-400 font-medium mb-8">Access your dashboard to track issues.</p>
              
              <form onSubmit={handleLogin} className="w-full space-y-5">
                <div className="relative group">
                  <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
                </div>
                <div className="relative group">
                  <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all hover:-translate-y-0.5 mt-2 cursor-pointer relative z-50 flex justify-center items-center gap-2">
                  <span>Login Securely</span>
                  <i className="fas fa-arrow-right text-sm"></i>
                </button>
              </form>
            </div>
          </div>

          {/* Sign Up Form (Anchored Right) */}
          <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out ${!isLogin ? 'translate-x-0 opacity-100 z-20 pointer-events-auto' : '-translate-x-[100%] opacity-0 pointer-events-none'}`}>
            <div className="w-full max-w-sm">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">Create Account</h2>
              <p className="text-zinc-400 font-medium mb-8">Join the platform to make your voice heard.</p>

              <form onSubmit={handleSignup} className="w-full space-y-5">
                <div className="relative group">
                  <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
                </div>
                <div className="relative group">
                  <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="University Email" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
                </div>
                <div className="relative group">
                  <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"></i>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all placeholder:text-zinc-500" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all hover:-translate-y-0.5 mt-2 cursor-pointer relative z-50 flex justify-center items-center gap-2">
                  <span>Sign Up Now</span>
                  <i className="fas fa-user-plus text-sm"></i>
                </button>
              </form>
            </div>
          </div>

          {/* ✨ UPGRADED Sliding Overlay Panel */}
          <div className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-transform duration-700 ease-in-out z-50 flex flex-col items-center justify-center text-center p-10 overflow-hidden ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
            
            {/* Overlay Inner Glow/Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">
                {isLogin ? 'New Here?' : 'Welcome Back!'}
              </h2>
              <p className="text-orange-50 font-medium mb-10 leading-relaxed drop-shadow max-w-[280px]">
                {isLogin 
                  ? 'Sign up and join thousands of students shaping a better university environment.' 
                  : 'To keep connected with us please login with your student credentials.'}
              </p>
              <button 
                onClick={toggleMode}
                className="px-10 py-3.5 bg-transparent border-2 border-white rounded-xl font-bold hover:bg-white hover:text-orange-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;