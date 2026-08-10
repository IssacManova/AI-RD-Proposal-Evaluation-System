import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard, Users, FileText, UserCog, Shield, Crown,
  Search, RefreshCw, Trash2, Edit3, X, Check, ChevronDown,
  AlertCircle, Loader2, UserCheck, UserX,
} from 'lucide-react';
import { usersApi } from '../../api/users';
import type { User, UserRole } from '../../types';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',      href: '/admin/users',     icon: Users },
  { label: 'Proposals',  href: '/admin/proposals', icon: FileText },
  { label: 'Profile',    href: '/admin/profile',   icon: UserCog },
];

const roleConfig: Record<UserRole, { cls: string; icon: typeof Shield; label: string }> = {
  researcher: { cls: 'badge-indigo',  icon: FileText, label: 'Researcher' },
  reviewer:   { cls: 'badge-emerald', icon: Shield,   label: 'Reviewer'   },
  admin:      { cls: 'badge-amber',   icon: Crown,    label: 'Admin'      },
};

const ROLES: UserRole[] = ['researcher', 'reviewer', 'admin'];

export default function UserManagement() {
  const [users, setUsers]         = useState<User[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole]   = useState<UserRole>('researcher');
  const [saving, setSaving]       = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to load users. Make sure the backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const startEdit = (u: User) => {
    setEditingId(u._id!);
    setEditRole(u.role);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (u: User) => {
    setSaving(true);
    try {
      await usersApi.updateUser(u._id!, { role: editRole });
      toast.success(`${u.name}'s role updated to ${editRole}`);
      setUsers((prev) =>
        prev.map((usr) => (usr._id === u._id ? { ...usr, role: editRole } : usr))
      );
      setEditingId(null);
    } catch {
      toast.error('Failed to update user role');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await usersApi.deleteUser(deleteId);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const roleCounts = {
    all:        users.length,
    researcher: users.filter((u) => u.role === 'researcher').length,
    reviewer:   users.filter((u) => u.role === 'reviewer').length,
    admin:      users.filter((u) => u.role === 'admin').length,
  };

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="User Management">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading…' : `${users.length} registered user${users.length !== 1 ? 's' : ''} in the system`}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="btn-ghost text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Role filter pills ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'researcher', 'reviewer', 'admin'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              roleFilter === r
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {r === 'all' ? 'All' : roleConfig[r].label}
            <span className="ml-1.5 opacity-70">({roleCounts[r]})</span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email…"
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* ── Error State ── */}
      {error && !loading && (
        <div className="p-4 mb-5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-sm">Loading users from database…</p>
        </div>
      )}

      {/* ── User Table ── */}
      {!loading && !error && (
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users match your search.</p>
            </div>
          ) : (
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
                  const rc = roleConfig[u.role];
                  const Icon = rc.icon;
                  const isEditing = editingId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      {/* User cell */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-600">
                              {u.name ? u.name[0].toUpperCase() : u.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{u.name || '—'}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role cell — inline edit */}
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <div className="relative">
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as UserRole)}
                              className="text-xs border border-primary-300 rounded-lg px-2 py-1.5 pr-6 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>{roleConfig[r].label}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                          </div>
                        ) : (
                          <span className={`${rc.cls} inline-flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {rc.label}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={u.status === 'inactive' ? 'badge-rose' : 'badge-emerald'}>
                          {u.status === 'inactive' ? (
                            <><UserX className="w-3 h-3 inline mr-1" />Inactive</>
                          ) : (
                            <><UserCheck className="w-3 h-3 inline mr-1" />Active</>
                          )}
                        </span>
                      </td>

                      {/* Joined date */}
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => saveEdit(u)}
                              disabled={saving}
                              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                              title="Save changes"
                            >
                              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="btn-ghost text-xs py-1.5 px-2 text-slate-500"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(u)}
                              className="btn-ghost text-xs py-1.5 px-3 text-slate-500 flex items-center gap-1"
                              title="Edit role"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteId(u._id!)}
                              className="btn-ghost text-xs py-1.5 px-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center mb-2">Delete User</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-700">
                {users.find((u) => u._id === deleteId)?.name || 'this user'}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 btn-ghost text-slate-600 py-2.5 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
