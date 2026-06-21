import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📝 Matches your Spring Boot Complaint.java model exactly
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'MEDIUM',
    isAnonymous: false,
    isPublic: true,
    creatorId: '2023100000176' // 🎯 Hardcoded to your specific Demo ID
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 🛡️ THE BULLETPROOF PAYLOAD
    // We send both the "is" prefixed and non-prefixed versions of the booleans 
    // to bypass the Jackson/Lombok mapping confusion entirely.
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      
      // Send both boolean formats
      isAnonymous: formData.isAnonymous,
      anonymous: formData.isAnonymous,
      isPublic: formData.isPublic,
      public: formData.isPublic,
      
      // Explicitly send defaults to prevent parsing errors
      upvotes: 0,
      comments: [],
      mediaUrls: [],
      
      creatorId: formData.creatorId
    };

    try {
      const response = await fetch('https://campusvoice-backend-ppgp.onrender.com/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the bulletproof payload
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Spring Boot Error Details:", errorText);
        throw new Error(`Status ${response.status}: ${errorText || 'Server rejected the request'}`);
      }

      const savedComplaint = await response.json();
      console.log('Success:', savedComplaint);
      
      alert(`Success! Your tracking ID is ${savedComplaint.trackingId}`);
      navigate('/dashboard');

    } catch (error) {
      console.error('Submission Error:', error.message);
      alert(`Failed to submit: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans selection:bg-orange-500/30 p-4 md:p-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      {/* --- Header / Back Navigation --- */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors cursor-pointer"
        >
          <i className="fas fa-arrow-left text-zinc-300 hover:text-white"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold">New Complaint</h1>
          <p className="text-sm text-zinc-400">Please provide detailed information for faster resolution.</p>
        </div>
      </div>

      {/* --- Main Form Container --- */}
      <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Issue Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g., Broken projector in Room 402" 
            required 
            className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600" 
          />
        </div>

        {/* Two Column Grid for Category & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Category</label>
            <div className="relative">
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-orange-500 transition-colors text-white"
              >
                <option value="IT">💻 IT & Network</option>
                <option value="Maintenance">🛠️ Maintenance</option>
                <option value="Office">🏢 Admin & Office</option>
                <option value="Security">🛡️ Security</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"></i>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Priority Level</label>
            <div className="relative">
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-orange-500 transition-colors text-white"
              >
                <option value="LOW">🟢 Low - Not urgent</option>
                <option value="MEDIUM">🟡 Medium - Needs attention</option>
                <option value="HIGH">🟠 High - Impacting work/study</option>
                <option value="URGENT">🔴 Urgent - Immediate risk</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Detailed Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Describe the issue, location, and any other relevant details..." 
            required 
            rows="5"
            className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600 resize-none" 
          ></textarea>
        </div>

        {/* Privacy Toggles */}
        <div className="bg-zinc-800/30 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Post Anonymously</p>
              <p className="text-xs text-zinc-400 mt-0.5">Hide your name and ID from the public feed.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="w-full h-px bg-white/5"></div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Make Public</p>
              <p className="text-xs text-zinc-400 mt-0.5">Allow other students to upvote and support this issue.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? (
            <i className="fas fa-circle-notch fa-spin text-xl"></i>
          ) : (
            <>
              <span>Submit Request</span>
              <i className="fas fa-paper-plane"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;