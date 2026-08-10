import { FileX, InboxIcon } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  icon?: 'inbox' | 'file';
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'No data available.',
  icon = 'inbox',
  action,
}: Props) {
  const Icon = icon === 'file' ? FileX : InboxIcon;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
