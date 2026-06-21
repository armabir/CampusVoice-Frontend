import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, Search, Bell, Menu, Plus, 
  ThumbsUp, MessageSquare, Clock, CheckCircle, 
  ArrowRight, Activity, EyeOff, Zap, Shield, 
  Star, Quote, ChevronRight, X
} from 'lucide-react';

// ==========================================
// 🚀 DATA & CONSTANTS
// ==========================================

const stats = [
  { id: 1, value: "12.4k+", label: "Total Complaints" },
  { id: 2, value: "98%", label: "Resolution Rate" },
  { id: 3, value: "5.2k", label: "Active Students" },
  { id: 4, value: "1.2 Days", label: "Avg. Resolution Time" },
];

const features = [
  { id: 1, title: "Anonymous Reporting", desc: "Speak your mind without fear. Toggle anonymity for sensitive issues while keeping authorities accountable.", icon: EyeOff },
  { id: 2, title: "Real-Time Tracking", desc: "No more black holes. Track your complaint's journey from submission to resolution with live status updates.", icon: Activity },
  { id: 3, title: "Public Complaint Feed", desc: "Discover what's trending. View, filter, and explore issues raised by other students across the entire campus.", icon: MessageSquare },
  { id: 4, title: "Upvote & Support", desc: "Numbers matter. Upvote critical issues to push them to the top of the administration's priority list.", icon: ThumbsUp },
  { id: 5, title: "Instant Notifications", desc: "Stay in the loop. Get immediate alerts when authorities reply, update status, or resolve your issue.", icon: Bell },
  { id: 6, title: "Fast Resolution", desc: "Our platform directly integrates with university workflows to ensure your problems are fixed faster than ever.", icon: Zap },
];

const steps = [
  { id: 1, title: "Submit", desc: "Log your issue in under 60 seconds with photos and details.", icon: Plus },
  { id: 2, title: "Track", desc: "Get a unique ID and watch your complaint move through the system.", icon: Search },
  { id: 3, title: "Review", desc: "Authorities prioritize issues based on community upvotes and urgency.", icon: Shield },
  { id: 4, title: "Resolve", desc: "Issue fixed? You'll be the first to know with a proof-of-resolution.", icon: CheckCircle },
];

const testimonials = [
  { id: 1, name: "Sarah Jenkins", role: "Computer Science, Junior", text: "The library WiFi was dropping for weeks. After it hit #1 on CampusVoice, IT fixed the routers in 24 hours. Incredible." },
  { id: 2, name: "David Chen", role: "Mechanical Engineering, Senior", text: "I love that I can report broken lab equipment anonymously. It makes highlighting safety hazards completely stress-free." },
  { id: 3, name: "Elena Rodriguez", role: "Business Admin, Sophomore", text: "Finally, a system that doesn't feel like sending emails into a void. The tracking UI is literally better than most apps I use." },
];

// ==========================================
// 🎨 UI COMPONENTS (DARK THEME)
// ==========================================

// --- Background Glow Effects ---
const BackgroundOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[150px]" />
    <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-[#FB923C]/5 blur-[150px]" />
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 👉 1. Initialize the navigate function
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300">
      <nav className={`w-full max-w-6xl rounded-2xl transition-all duration-300 ${isScrolled ? 'bg-[#0B0F19]/80 backdrop-blur-xl shadow-lg shadow-black/50 border border-white/10 py-3 px-6' : 'bg-transparent py-4 px-6'}`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Megaphone size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CampusVoice</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Features', 'How It Works'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '')}`} className="text-sm font-semibold text-slate-400 hover:text-orange-400 transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 👉 2. Add the onClick handler to the Login button */}
            <button 
              onClick={() => navigate('/auth')} 
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Login
            </button>
            
            <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#0B0F19] bg-white hover:bg-slate-200 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
              Submit Complaint
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </div>
  );
};

// --- Abstract UI Mockup (Right side of Hero) ---
const DashboardMockup = () => (
  <div className="relative w-full h-[500px] rounded-[2rem] bg-[#111827]/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 p-6 overflow-hidden hidden lg:block transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
    {/* Mockup Header */}
    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-red-400 transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-amber-400 transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-green-400 transition-colors cursor-pointer" />
      </div>
      <div className="h-6 w-32 bg-slate-800 rounded-full" />
    </div>

    {/* Mockup Content Grid */}
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <div className="w-1/4 space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 w-full bg-slate-800/50 rounded-lg" />
        ))}
        <div className="mt-12 h-32 w-full rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 flex flex-col justify-end p-4">
           <div className="h-2 w-1/2 bg-orange-400/50 rounded-full mb-2" />
           <div className="h-2 w-3/4 bg-orange-400/30 rounded-full" />
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 space-y-4">
        {/* Mock Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-800/50 shadow-sm border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
          <div className="flex justify-between mb-3">
            <div className="h-4 w-1/3 bg-slate-700 rounded-full" />
            <div className="h-5 w-16 bg-amber-500/20 border border-amber-500/30 rounded-full" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-2 w-full bg-slate-700/50 rounded-full" />
            <div className="h-2 w-5/6 bg-slate-700/50 rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-16 bg-orange-500/10 rounded-full border border-orange-500/20" />
            <div className="h-6 w-16 bg-slate-700/50 rounded-full" />
          </div>
        </div>

        {/* Mock Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-800/50 shadow-sm border border-white/5 relative">
           <div className="absolute top-0 left-0 w-1 h-full bg-slate-600" />
           <div className="flex justify-between mb-3">
            <div className="h-4 w-1/2 bg-slate-700 rounded-full" />
            <div className="h-5 w-20 bg-green-500/20 border border-green-500/30 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-700/50 rounded-full" />
            <div className="h-2 w-2/3 bg-slate-700/50 rounded-full" />
          </div>
        </div>
      </div>
    </div>

    {/* Floating Elements */}
    <div className="absolute top-1/2 right-[-20px] p-4 rounded-2xl bg-slate-800/90 backdrop-blur-md shadow-2xl border border-white/10 flex items-center gap-4 transform -translate-y-1/2 animate-bounce-slow">
      <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
        <CheckCircle size={20} />
      </div>
      <div>
        <div className="h-3 w-24 bg-slate-300 rounded-full mb-2" />
        <div className="h-2 w-16 bg-slate-500 rounded-full" />
      </div>
    </div>
  </div>
);

// --- Hero Section ---
const Hero = () => (
  <section id="home" className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-orange-500/30 text-orange-400 text-sm font-bold uppercase tracking-wider mb-8 shadow-sm shadow-orange-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          University Platform 2.0
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          One Voice Can Be Ignored. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            Hundreds Can't.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
          The modern OS for campus life. Report issues, track administrative progress, and unite with peers to build a better university environment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
            Submit Complaint <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-300 bg-slate-800/50 backdrop-blur-md border border-white/10 hover:bg-slate-800 hover:border-orange-500/50 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
            Explore Issues
          </button>
        </div>
      </div>

      <DashboardMockup />
    </div>
  </section>
);

// --- Stats Section ---
const Stats = () => (
  <section className="py-10 px-4 max-w-7xl mx-auto z-10 relative">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
      {stats.map((stat) => (
        <div key={stat.id} className="p-6 rounded-3xl bg-slate-800/40 backdrop-blur-xl border border-white/5 shadow-lg shadow-black/20 text-center hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{stat.value}</h3>
          <p className="text-sm font-semibold text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  </section>
);

// --- Features Section ---
const Features = () => (
  <section id="features" className="py-24 px-4 max-w-7xl mx-auto z-10 relative">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Everything You Need to Be Heard</h2>
      <p className="text-lg text-slate-400 font-medium">A powerful suite of tools designed specifically for students to bring transparency and speed to campus issue resolution.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <div key={feature.id} className="p-8 rounded-3xl bg-slate-800/40 backdrop-blur-lg border border-white/5 shadow-xl shadow-black/20 hover:bg-slate-800/80 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
            <feature.icon size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
          <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// --- How It Works Section ---
const HowItWorks = () => (
  <section id="howitworks" className="py-24 px-4 z-10 relative overflow-hidden">
    {/* Section Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent pointer-events-none" />
    
    <div className="max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">How CampusVoice Works</h2>
        <p className="text-lg text-slate-400 font-medium">A seamless, fully transparent pipeline from identifying a problem to celebrating its resolution.</p>
      </div>

      <div className="relative">
        {/* Desktop Connecting Line */}
        <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-gradient-to-r from-slate-700 via-orange-500/50 to-slate-700 -translate-y-1/2 rounded-full opacity-50 z-0" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-white/10 shadow-xl shadow-black/40 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm border-4 border-[#0B0F19]">
                  {step.id}
                </div>
                <step.icon size={32} className={index === 3 ? "text-green-400" : "text-slate-300 group-hover:text-orange-400 transition-colors"} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 font-medium max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- Testimonials Section ---
const Testimonials = () => (
  <section className="py-24 px-4 max-w-7xl mx-auto z-10 relative">
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Loved by Students.</h2>
      <p className="text-lg text-slate-400 font-medium">Don't just take our word for it.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((test) => (
        <div key={test.id} className="p-8 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/5 shadow-lg shadow-black/20 relative">
          <Quote className="absolute top-6 right-6 text-white/5" size={60} />
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} className="fill-orange-500 text-orange-500" />)}
          </div>
          <p className="text-slate-300 font-medium leading-relaxed mb-8 text-lg relative z-10">"{test.text}"</p>
          <div>
            <h4 className="font-bold text-white">{test.name}</h4>
            <p className="text-sm font-semibold text-slate-500">{test.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// --- Final CTA Section ---
const FinalCTA = () => (
  <section className="py-20 px-4 max-w-5xl mx-auto z-10 relative">
    <div className="rounded-[3rem] bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.3)] border border-orange-400/50">
      {/* Decorative background patterns inside CTA */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">Help Make Campus Better</h2>
        <p className="text-orange-100 text-xl font-medium mb-10 max-w-2xl mx-auto drop-shadow">
          Join thousands of students who are already shaping a better university experience. Your voice is the catalyst for change.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 rounded-2xl text-slate-900 font-bold text-lg bg-white hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1">
            Submit a Complaint
          </button>
          <button className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/30 transition-all flex items-center justify-center gap-2">
            View Public Issues <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  </section>
);

// --- Footer ---
const Footer = () => (
  <footer className="bg-[#0B0F19] border-t border-white/5 pt-16 pb-8 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-orange-500 text-white">
              <Megaphone size={18} />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">CampusVoice</span>
          </div>
          <p className="text-slate-400 font-medium text-sm max-w-sm mb-6 leading-relaxed">
            Empowering students to build a better campus environment through modern, transparent reporting and community collaboration.
          </p>
        </div>
        
        <div>
          <h4 className="font-extrabold text-white mb-6">Platform</h4>
          <ul className="space-y-3 text-sm font-semibold text-slate-400">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Explore Issues</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Submit Complaint</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Statistics</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Guidelines</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-white mb-6">Legal</h4>
          <ul className="space-y-3 text-sm font-semibold text-slate-400">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Admin</a></li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-semibold text-slate-500">© 2026 CampusVoice. All rights reserved.</p>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span> Systems Operational
        </div>
      </div>
    </div>
  </footer>
);

// ==========================================
// 🚀 MAIN APP CONTAINER
// ==========================================

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans selection:bg-orange-500/30 selection:text-orange-200 relative overflow-x-hidden">
      <BackgroundOrbs />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}