import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { UserRole } from '../../types';
import toast from 'react-hot-toast';

function passwordStrength(pwd: string): { level: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { level: 0, label: '', color: '' },
    { level: 1, label: 'Weak', color: 'bg-rose-500' },
    { level: 2, label: 'Fair', color: 'bg-amber-500' },
    { level: 3, label: 'Good', color: 'bg-sky-500' },
    { level: 4, label: 'Strong', color: 'bg-emerald-500' },
  ];
  return { ...map[score], level: score };
}

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState<UserRole>('researcher');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (strength.level < 2) { setError('Please use a stronger password.'); return; }
    setLoading(true);
    try {
      await register({ name, email, password, role });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'researcher', label: 'Researcher', desc: 'Upload and track proposals' },
    { value: 'reviewer',   label: 'Reviewer',   desc: 'Review and evaluate proposals' },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-0 w-96 h-96 bg-primary-700/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-700/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">AI-RD</p>
              <p className="text-[10px] text-white/40">Evaluation System</p>
            </div>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 shadow-glow-lg border border-white/20">
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-white/50 mb-6">Join the AI-powered research evaluation platform</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Full name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Smith" required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Email address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@university.edu" required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all duration-150 ${
                      role === r.value
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-white/5 border-white/20 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-xs font-bold">{r.label}</p>
                    <p className="text-[9px] opacity-70 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex-1 rounded-full transition-colors duration-300 ${i <= strength.level ? strength.color : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                {confirm && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirm === password
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 justify-center text-sm font-semibold mt-1">
              {loading ? <><LoadingSpinner size="sm" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-300 hover:text-primary-200 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
