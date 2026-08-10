import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { FileText, LayoutDashboard, Upload, User, Mail, Shield, KeyRound, Eye, EyeOff, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Props { role: 'researcher' | 'reviewer' | 'admin' }

const navsByRole = {
  researcher: [
    { label: 'Dashboard',       href: '/researcher',          icon: LayoutDashboard },
    { label: 'Upload Proposal', href: '/researcher/upload',   icon: Upload },
    { label: 'My Proposals',    href: '/researcher/proposals',icon: FileText },
    { label: 'Profile',         href: '/researcher/profile',  icon: User },
  ],
  reviewer: [
    { label: 'Dashboard',         href: '/reviewer',          icon: LayoutDashboard },
    { label: 'Assigned Proposals',href: '/reviewer/proposals',icon: FileText },
    { label: 'Profile',           href: '/reviewer/profile',  icon: User },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin',           icon: LayoutDashboard },
    { label: 'Users',     href: '/admin/users',     icon: User },
    { label: 'Proposals', href: '/admin/proposals', icon: FileText },
    { label: 'Profile',   href: '/admin/profile',   icon: User },
  ],
};

export default function ProfilePage({ role }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showLogout, setShowLogout]     = useState(false);
  const [currentPwd, setCurrentPwd]     = useState('');
  const [newPwd, setNewPwd]             = useState('');
  const [showCur, setShowCur]           = useState(false);
  const [showNew, setShowNew]           = useState(false);

  const navItems = navsByRole[role];
  const roleLabel = { researcher: 'Researcher', reviewer: 'Reviewer', admin: 'Administrator' }[role];
  const roleColor = { researcher: 'bg-emerald-500', reviewer: 'bg-sky-500', admin: 'bg-amber-500' }[role];

  const handleLogout = () => { logout(); navigate('/'); };

  const handleChangePwd = () => {
    toast.success('Password change is not yet available (backend endpoint pending).');
    setShowPwdModal(false);
    setCurrentPwd(''); setNewPwd('');
  };

  return (
    <DashboardLayout items={navItems} role={role} pageTitle="Profile">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information.</p>
        </div>

        {/* Profile card */}
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
            <div className={`w-16 h-16 ${roleColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <span className="text-2xl font-bold text-white">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">{user?.email}</p>
              <span className={`badge mt-1 ${role === 'admin' ? 'badge-amber' : role === 'reviewer' ? 'badge-sky' : 'badge-emerald'}`}>
                <Shield className="w-3 h-3" /> {roleLabel}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow icon={<Mail className="w-4 h-4 text-slate-400" />}   label="Email"   value={user?.email || '—'} />
            <InfoRow icon={<Shield className="w-4 h-4 text-slate-400" />} label="Role"    value={roleLabel} />
          </div>
        </div>

        {/* Security */}
        <div className="card p-6 mb-5">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-slate-500" /> Security
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Password</p>
              <p className="text-xs text-slate-400 mt-0.5">Change your account password</p>
            </div>
            <button onClick={() => setShowPwdModal(true)} className="btn-secondary text-sm">
              Change Password
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="card p-6">
          <h3 className="section-title mb-4 flex items-center gap-2">
            <LogOut className="w-4 h-4 text-slate-500" /> Account
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Sign Out</p>
              <p className="text-xs text-slate-400 mt-0.5">End your current session</p>
            </div>
            <button onClick={() => setShowLogout(true)} className="btn-danger text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Change password modal */}
      <Modal isOpen={showPwdModal} onClose={() => setShowPwdModal(false)} title="Change Password" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input type={showCur ? 'text' : 'password'} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowCur(!showCur)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showCur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleChangePwd} className="btn-primary flex-1 justify-center">Update Password</button>
            <button onClick={() => setShowPwdModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Confirm logout modal */}
      <Modal isOpen={showLogout} onClose={() => setShowLogout(false)} title="Sign Out" size="sm">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to sign out?</p>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="btn-danger flex-1 justify-center">Sign Out</button>
          <button onClick={() => setShowLogout(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-xs font-semibold text-slate-500 w-20 flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}
