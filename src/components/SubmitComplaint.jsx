import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, UploadCloud, Loader2, AlertCircle, 
  Shield, Globe, CheckCircle2, X 
} from 'lucide-react';

const SubmitComplaint = () => {
  const navigate = useNavigate();

  // --- FORM STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [mediaUrls, setMediaUrls] = useState([]);
  
  // --- UI STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- OPTIONS ---
  const categories = ['IT Infrastructure', 'Maintenance', 'Student Services', 'Academic', 'Campus Security', 'Other'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) return; // Basic validation
    
    setIsSubmitting(true);

    // MOCK API CALL
    const payload = {
      title, description, category, priority, isAnonymous, isPublic, mediaUrls
    };
    
    console.log("Submitting payload:", payload);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard'); // Route back to dashboard after success
    }, 1500);
  };

  // Mock File Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Mocking a successful upload URL
      setMediaUrls(prev => [...prev, URL.createObjectURL(files[0])]);
    }
  };

  const removeMedia = (index) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans selection:bg-orange-500/30 p-6 md:p-12 flex flex-col">
      
      {/* HEADER */}
      <div className="max-w-3xl mx-auto w-full mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* FORM CONTAINER */}
      <div className="max-w-3xl mx-auto w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Submit a Complaint</h1>
          <p className="text-zinc-400">Provide details about the issue so we can help resolve it quickly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* TITLE */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Give your complaint a short, clear title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 pb-4 text-2xl font-semibold placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Description</label>
            <textarea
              placeholder="Explain what happened in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none placeholder-zinc-600"
              required
            />
          </div>

          {/* CATEGORY (CHIPS) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Category
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    category === cat 
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PRIORITY (CHIPS) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Priority Level</label>
            <div className="flex flex-wrap gap-3">
              {priorities.map((pri) => (
                <button
                  key={pri}
                  type="button"
                  onClick={() => setPriority(pri)}
                  className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-200 border ${
                    priority === pri 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                      : 'bg-transparent text-zinc-400 border-white/20 hover:border-white/40'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* PRIVACY TOGGLES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Anonymous Toggle */}
            <div className="flex items-start justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
              <div className="pr-4">
                <h4 className="font-semibold text-white flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-orange-400" /> Submit Anonymously
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Hide your identity from campus administration. Only system admins can trace this if necessary.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAnonymous ? 'bg-orange-500' : 'bg-zinc-700'}`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Public Toggle */}
            <div className="flex items-start justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
              <div className="pr-4">
                <h4 className="font-semibold text-white flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-blue-400" /> Public Campus Feed
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Allow other students to see and upvote this issue. (Recommended for infrastructure issues).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPublic ? 'bg-blue-500' : 'bg-zinc-700'}`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* MEDIA UPLOAD (DRAG & DROP) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Attachments (Optional)</label>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center ${
                isDragging ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-700 bg-black/10 hover:bg-black/20 hover:border-zinc-500'
              }`}
            >
              <UploadCloud className={`w-10 h-10 mb-4 ${isDragging ? 'text-orange-400' : 'text-zinc-500'}`} />
              <p className="text-sm font-medium text-white mb-1">Drag and drop your files here</p>
              <p className="text-xs text-zinc-500">or click to browse (PNG, JPG, PDF up to 10MB)</p>
            </div>

            {/* Uploaded Media Previews */}
            {mediaUrls.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {mediaUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden border border-white/10 group">
                    <img src={url} alt="upload preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <button 
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !title || !description || !category}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center space-x-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;