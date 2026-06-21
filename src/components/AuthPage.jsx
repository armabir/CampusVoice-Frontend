import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form State (Gender removed)
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

    try {
      // Updated to match port 9098
      const response = await fetch(`https://campusvoice-backend-ppgp.onrender.com/api/users/search?email=${formData.email}`);
      
      // Enhanced Response Parsing
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Login failed: ${errorText || "User not found!"}`);
        return;
      }

      const user = await response.json();
      
      // Basic client-side password check
      if (user.password === formData.password) {
        console.log("Login successful!", user);
        alert(`Welcome back, ${user.name}!`);
        navigate('/dashboard'); 
      } else {
        alert("Incorrect password!");
      }
      
    } catch (error) {
      // Enhanced Error Handling
      console.error("Login Error:", error.message);
      if (error.message === "Failed to fetch" || error.message.includes("Network Error")) {
        alert("Network Error: Cannot connect to the server. Please check if your backend is running or verify your CORS settings.");
      } else {
        alert("An unexpected error occurred during login.");
      }
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

      // Enhanced Response Parsing
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Signup failed: ${errorText || "Email might already be in use."}`);
        return;
      }

      const newUser = await response.json();
      console.log("Signup successful!", newUser);
      alert("Account created successfully! Please sign in.");
      toggleMode(); // Slide back to login screen

    } catch (error) {
      // Enhanced Error Handling
      console.error("Signup Error:", error.message);
      if (error.message === "Failed to fetch" || error.message.includes("Network Error")) {
        alert("Network Error: Cannot connect to the server. Please check if your backend is running or verify your CORS settings.");
      } else {
        alert("An unexpected error occurred during signup.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 font-sans text-white">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* Main Glass Container */}
      <div className="relative w-full max-w-4xl h-[600px] md:h-[500px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- MOBILE VIEW (Stacked Toggle) --- */}
        <div className="md:hidden flex flex-col items-center justify-center w-full h-full p-8 space-y-6 transition-all duration-500">
          <h2 className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          <form 
            onSubmit={isLogin ? handleLogin : handleSignup} 
            className="w-full space-y-4 flex flex-col"
          >
            {!isLogin && (
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
            )}

            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
            </div>

            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all z-50 relative pointer-events-auto cursor-pointer">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-zinc-400 cursor-pointer hover:text-white" onClick={toggleMode}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </p>
        </div>

        {/* --- DESKTOP VIEW (Sliding Overlay) --- */}
        <div className="hidden md:flex w-full h-full relative">
          
          {/* Sign In Form (Anchored Left) */}
          <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out ${isLogin ? 'translate-x-0 opacity-100 z-20 pointer-events-auto' : 'translate-x-[100%] opacity-0 pointer-events-none'}`}>
            <h2 className="text-4xl font-bold mb-6 text-orange-500">Sign In</h2>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all mt-4 cursor-pointer relative z-50">
                Login
              </button>
            </form>
          </div>

          {/* Sign Up Form (Anchored Right) */}
          <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out ${!isLogin ? 'translate-x-0 opacity-100 z-20 pointer-events-auto' : '-translate-x-[100%] opacity-0 pointer-events-none'}`}>
            <h2 className="text-4xl font-bold mb-6 text-orange-500">Create Account</h2>
            <form onSubmit={handleSignup} className="w-full space-y-4">
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all mt-4 cursor-pointer relative z-50">
                Sign Up
              </button>
            </form>
          </div>

          {/* Sliding Overlay Panel */}
          <div className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl transition-transform duration-700 ease-in-out z-50 flex flex-col items-center justify-center text-center p-10 ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-4">
              {isLogin ? 'New Here?' : 'Welcome Back!'}
            </h2>
            <p className="text-orange-50 mb-8 leading-relaxed">
              {isLogin 
                ? 'Sign up and discover a great amount of new opportunities waiting for you.' 
                : 'To keep connected with us please login with your personal info.'}
            </p>
            <button 
              onClick={toggleMode}
              className="px-8 py-3 bg-transparent border-2 border-white rounded-xl font-bold hover:bg-white hover:text-orange-500 transition-colors cursor-pointer"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;