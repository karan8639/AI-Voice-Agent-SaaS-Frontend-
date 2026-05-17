import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';

import LandingPage from './LandingPage';
import DashboardLayout from './DashboardLayout';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import CommandCenter from './CommandCenter';
import KnowledgeForge from './KnowledgeForge';
import CallIntelligence from './CallIntelligence';
import AgentSettings from './AgentSettings';
import TeamManagement from './TeamManagement';
import Dashboard from './Dashboard';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
      <BrowserRouter>
        {/*
          AuthProvider must be INSIDE BrowserRouter because it uses
          useNavigate() internally for post-login / logout redirects.
        */}
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/home" replace />} />
              <Route path="home" element={<CommandCenter />} />
              <Route path="knowledge" element={<KnowledgeForge />} />
              <Route path="calls" element={<CallIntelligence />} />
              <Route path="agents" element={<Dashboard />} />
              <Route path="settings" element={<AgentSettings />} />
              <Route path="team" element={<TeamManagement />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
