import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { Landing } from './pages/Landing';
import { Report } from './pages/Report';
import { Feed } from './pages/Feed';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IncidentProvider>
        <HashRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-electric-blue selection:text-white">
            <Navigation />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/feed" element={<Feed />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/report" element={<Report />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={[UserRole.RESPONDER]} />}>
                <Route path="/admin" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
        </HashRouter>
      </IncidentProvider>
    </AuthProvider>
  );
};

export default App;