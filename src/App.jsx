import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Imports ---
import Landing from './components/Landing';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import SubmitComplaint from './components/SubmitComplaint'; // 👈 1. Import the new component

function App() {
  return (
    <Router>
      <Routes>
        {/* Set Landing page as the default root */}
        <Route path="/" element={<Landing />} />
        
        {/* Core App Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 👈 2. Add the Submit Complaint route */}
        <Route path="/submit" element={<SubmitComplaint />} /> 
        <Route element="{<AdminDashboard" path="/admin-dashboard"/>
        
        {/* Catch-all for 404s - redirects back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;