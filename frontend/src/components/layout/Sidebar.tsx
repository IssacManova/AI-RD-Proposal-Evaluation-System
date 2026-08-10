import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface Props {
  items: NavItem[];
  role: string;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ items, role, onCollapse }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);
  };

  useEffect(() => {
    onCollapse?.(collapsed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'reviewer' ? 'Reviewer' : 'Researcher';
  const roleColor =
    role === 'admin'    ? 'bg-amber-500' :
    role === 'reviewer' ? 'bg-sky-500'   : 'bg-emerald-500';

  const roleGlow =
    role === 'admin'    ? 'shadow-glow-amber' :
    role === 'reviewer' ? 'shadow-glow-sky'   : 'shadow-glow-emerald';

  return (
    <aside className={`
      fixed top-0 left-0 h-full z-30 flex flex-col
      bg-navy-900 border-r border-white/10
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-[68px]' : 'w-60'}
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-xs font-bold text-white leading-none tracking-wide">AI-RD</p>
            <p className="text-[10px] text-white/40 mt-0.5">Evaluation System</p>
          </div>
        )}
      </div>

      {/* User badge */}
      {!collapsed && (
        <div className="mx-3 my-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${roleColor} ${roleGlow} flex items-center justify-center flex-shrink-0`}>
              <span className="text-xs font-bold text-white">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-white/40">{roleLabel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed user avatar */}
      {collapsed && (
        <div className="flex justify-center my-3">
          <div className={`w-8 h-8 rounded-lg ${roleColor} flex items-center justify-center`}>
            <span className="text-xs font-bold text-white">{user?.email?.[0]?.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        {items.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href || location.pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              to={href}
              title={collapsed ? label : undefined}
              className={`
                ${active ? 'nav-item-active' : 'nav-item-inactive'}
                ${collapsed ? 'justify-center px-0' : ''}
                group relative
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {/* Active indicator dot */}
              {active && collapsed && (
                <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/10 pt-3">
        <button
          onClick={handleLogout}
          className={`nav-item-inactive w-full hover:bg-rose-500/20 hover:text-rose-300 ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-navy-900 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-150 shadow-inner-glow"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-white" />
          : <ChevronLeft  className="w-3 h-3 text-white" />}
      </button>
    </aside>
  );
}
