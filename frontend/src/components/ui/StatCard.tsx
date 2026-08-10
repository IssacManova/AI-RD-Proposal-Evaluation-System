import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
  trend?: { value: string; positive: boolean };
}

const colors = {
  indigo: {
    bg: 'bg-card-gradient',
    iconBg: 'bg-primary-600',
    iconShadow: 'shadow-glow',
    text: 'text-primary-600',
    border: 'border-primary-100',
  },
  emerald: {
    bg: 'bg-card-gradient-emerald',
    iconBg: 'bg-emerald-600',
    iconShadow: 'shadow-glow-emerald',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  amber: {
    bg: 'bg-card-gradient-amber',
    iconBg: 'bg-amber-500',
    iconShadow: 'shadow-glow-amber',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
  rose: {
    bg: 'bg-card-gradient-rose',
    iconBg: 'bg-rose-600',
    iconShadow: 'shadow-glow-rose',
    text: 'text-rose-600',
    border: 'border-rose-100',
  },
  sky: {
    bg: 'bg-card-gradient-sky',
    iconBg: 'bg-sky-500',
    iconShadow: 'shadow-glow-sky',
    text: 'text-sky-600',
    border: 'border-sky-100',
  },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend }: Props) {
  const c = colors[color];
  return (
    <div className={`rounded-2xl border ${c.border} shadow-card ${c.bg} p-6 animate-slide-up hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-extrabold mt-2 ${c.text} animate-count-up`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
              trend.positive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${c.iconBg} ${c.iconShadow} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
