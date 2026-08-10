import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleProtectedRoute } from './routes/ProtectedRoute';

// Public
import LandingPage    from './pages/public/LandingPage';
import LoginPage      from './pages/public/LoginPage';
import RegisterPage   from './pages/public/RegisterPage';

// Researcher
import ResearcherDashboard from './pages/researcher/ResearcherDashboard';
import UploadProposal      from './pages/researcher/UploadProposal';
import MyProposals         from './pages/researcher/MyProposals';
import ProposalDetail      from './pages/researcher/ProposalDetail';

// Reviewer
import ReviewerDashboard  from './pages/reviewer/ReviewerDashboard';
import AssignedProposals  from './pages/reviewer/AssignedProposals';
import ReviewProposal     from './pages/reviewer/ReviewProposal';

// Admin
import AdminDashboard    from './pages/admin/AdminDashboard';
import UserManagement    from './pages/admin/UserManagement';
import ProposalManagement from './pages/admin/ProposalManagement';
import AdminProposalDetail from './pages/admin/AdminProposalDetail';

// Shared
import ProfilePage from './pages/shared/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
          }}
        />
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Researcher ── */}
          <Route path="/researcher" element={
            <RoleProtectedRoute role="researcher" fallback="/login">
              <ResearcherDashboard />
            </RoleProtectedRoute>
          } />
          <Route path="/researcher/upload" element={
            <RoleProtectedRoute role="researcher" fallback="/login">
              <UploadProposal />
            </RoleProtectedRoute>
          } />
          <Route path="/researcher/proposals" element={
            <RoleProtectedRoute role="researcher" fallback="/login">
              <MyProposals />
            </RoleProtectedRoute>
          } />
          <Route path="/researcher/proposals/:id" element={
            <RoleProtectedRoute role="researcher" fallback="/login">
              <ProposalDetail />
            </RoleProtectedRoute>
          } />
          <Route path="/researcher/profile" element={
            <RoleProtectedRoute role="researcher" fallback="/login">
              <ProfilePage role="researcher" />
            </RoleProtectedRoute>
          } />

          {/* ── Reviewer ── */}
          <Route path="/reviewer" element={
            <RoleProtectedRoute role="reviewer" fallback="/login">
              <ReviewerDashboard />
            </RoleProtectedRoute>
          } />
          <Route path="/reviewer/proposals" element={
            <RoleProtectedRoute role="reviewer" fallback="/login">
              <AssignedProposals />
            </RoleProtectedRoute>
          } />
          <Route path="/reviewer/proposals/:id" element={
            <RoleProtectedRoute role="reviewer" fallback="/login">
              <ReviewProposal />
            </RoleProtectedRoute>
          } />
          <Route path="/reviewer/all" element={<Navigate to="/reviewer/proposals" replace />} />
          <Route path="/reviewer/profile" element={
            <RoleProtectedRoute role="reviewer" fallback="/login">
              <ProfilePage role="reviewer" />
            </RoleProtectedRoute>
          } />

          {/* ── Admin ── */}
          <Route path="/admin" element={
            <RoleProtectedRoute role="admin" fallback="/login">
              <AdminDashboard />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <RoleProtectedRoute role="admin" fallback="/login">
              <UserManagement />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/proposals" element={
            <RoleProtectedRoute role="admin" fallback="/login">
              <ProposalManagement />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/proposals/:id" element={
            <RoleProtectedRoute role="admin" fallback="/login">
              <AdminProposalDetail />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <RoleProtectedRoute role="admin" fallback="/login">
              <ProfilePage role="admin" />
            </RoleProtectedRoute>
          } />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
