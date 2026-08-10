import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Brain, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { LucideIcon } from 'lucide-react';
import Sidebar from './Sidebar';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface Props {
  items: NavItem[];
  role: string;
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({ items, role, children, pageTitle }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar items={items} role={role} onCollapse={setSidebarCollapsed} />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-navy-900 z-50 animate-slide-in-right">
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-glow">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">AI-RD</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-2 py-3 space-y-0.5">
              {items.map(({ label, href, icon: Icon }) => {
                const active = location.pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className={active ? 'nav-item-active' : 'nav-item-inactive'}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-2 mt-2 border-t border-white/10 pt-2">
              <button
                onClick={handleLogout}
                className="nav-item-inactive w-full hover:bg-rose-500/20 hover:text-rose-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content — shifts based on sidebar collapse state */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-60'}
        `}
      >
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="btn-ghost p-1.5">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center shadow-glow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">{pageTitle || 'Dashboard'}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
