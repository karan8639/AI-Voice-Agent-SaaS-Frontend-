import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import DashboardLayout from './DashboardLayout';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import CommandCenter from './CommandCenter';
import KnowledgeForge from './KnowledgeForge';
import CallIntelligence from './CallIntelligence';
import AgentSettings from './AgentSettings';
import TeamManagement from './TeamManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard Parent Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<CommandCenter />} />
          <Route path="knowledge" element={<KnowledgeForge />} />
          <Route path="calls" element={<CallIntelligence />} />
          <Route path="settings" element={<AgentSettings />} />
          <Route path="team" element={<TeamManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
