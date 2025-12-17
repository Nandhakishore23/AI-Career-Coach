import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
// Dashboard Components
import DashboardLayout from './components/DashboardLayout';
import RoadmapTracker from './components/RoadmapTracker';
// New Pages
import MockInterviews from './pages/MockInterviews';
import ResumeBuilder from './pages/ResumeBuilder';
import CodingArena from './pages/CodingArena';
import UserProfile from './pages/UserProfile';

import Onboarding from './pages/Onboarding';
import TopicPage from './pages/TopicPage';
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Dashboard Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="roadmap" replace />} />
            <Route path="roadmap" element={<RoadmapTracker />} />
            <Route path="coding" element={<CodingArena />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="interviews" element={<MockInterviews />} />
            <Route path="resume" element={<ResumeBuilder />} />
          </Route>

          <Route path="/learning" element={<TopicPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
