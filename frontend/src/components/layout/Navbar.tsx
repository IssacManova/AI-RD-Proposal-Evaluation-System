import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardPath =
    user?.role === 'admin'    ? '/admin'    :
    user?.role === 'reviewer' ? '/reviewer' : '/researcher';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-white">AI-RD</span>
              <span className="text-sm font-light text-white/60 ml-1">Evaluation</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/#features">Features</NavLink>
            <NavLink href="/#how-it-works">How It Works</NavLink>
            <NavLink href="/#technology">Technology</NavLink>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn-ghost text-white/80 hover:text-white hover:bg-white/10">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-white/80 hover:text-white hover:bg-white/10">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden btn-ghost text-white/80 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 py-4 space-y-1 animate-slide-up">
          <MobileLink href="/#features" onClick={() => setOpen(false)}>Features</MobileLink>
          <MobileLink href="/#how-it-works" onClick={() => setOpen(false)}>How It Works</MobileLink>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-white/10 rounded-lg transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/register" className="block px-3 py-2 text-sm font-semibold text-primary-300 hover:text-primary-200 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-150">
      {children}
    </a>
  );
}
function MobileLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <a href={href} onClick={onClick} className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
      {children}
    </a>
  );
}
