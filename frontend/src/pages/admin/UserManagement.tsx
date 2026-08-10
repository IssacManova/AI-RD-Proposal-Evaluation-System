import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LayoutDashboard, Users, FileText, UserCog, Shield, Mail, Crown, Eye, EyeOff } from 'lucide-react';

// Admin user management — stub page (backend GET /users/ endpoint not yet available)
const navItems = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',      href: '/admin/users',     icon: Users },
  { label: 'Proposals',  href: '/admin/proposals', icon: FileText },
  { label: 'Profile',    href: '/admin/profile',   icon: UserCog },
];

const MOCK_USERS = [
  { id: '1', name: 'Dr. Alice Rahman',   email: 'alice@university.edu',  role: 'researcher', status: 'active', joined: '2026-01-15' },
  { id: '2', name: 'Prof. John Doe',     email: 'john@university.edu',   role: 'reviewer',   status: 'active', joined: '2026-02-10' },
  { id: '3', name: 'Admin User',         email: 'admin@university.edu',  role: 'admin',      status: 'active', joined: '2025-12-01' },
  { id: '4', name: 'Dr. Sara Al-Amin',  email: 'sara@university.edu',   role: 'researcher', status: 'active', joined: '2026-03-20' },
  { id: '5', name: 'Prof. Lee Zhao',    email: 'lee@university.edu',    role: 'reviewer',   status: 'active', joined: '2026-04-05' },
];

const roleConfig = {
  researcher: { cls: 'badge-indigo',  icon: FileText,  label: 'Researcher' },
  reviewer:   { cls: 'badge-emerald', icon: Shield,    label: 'Reviewer'   },
  admin:      { cls: 'badge-amber',   icon: Crown,     label: 'Admin'      },
};

export default function UserManagement() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="User Management">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {MOCK_USERS.length} registered users ·{' '}
            <span className="text-amber-600 font-medium">GET /users/ endpoint coming soon</span>
          </p>
        </div>
      </div>

      {/* Notice */}
      <div className="p-4 mb-5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          User management data shown here is illustrative. The backend <code className="font-mono bg-amber-100 px-1 rounded">GET /users/</code> endpoint
          has not yet been implemented. Once added, this page will connect automatically.
        </p>
      </div>

      <div className="card p-4 mb-5">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name or email…" className="input-field pl-9" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">User</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Role</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Joined</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((u) => {
              const rc = roleConfig[u.role as keyof typeof roleConfig];
              const Icon = rc.icon;
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-600">{u.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`${rc.cls} inline-flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      {rc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="badge-emerald">Active</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{u.joined}</td>
                  <td className="px-4 py-3.5">
                    <button className="btn-ghost text-xs py-1.5 px-3 text-slate-500" title="View user (coming soon)">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
