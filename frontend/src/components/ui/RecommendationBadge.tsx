import type { RecommendationStatus } from '../../types';
import { CheckCircle, Clock, Edit, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  recommendation: string;
  size?: 'sm' | 'md';
}

function classify(rec: string): RecommendationStatus {
  const r = rec.toLowerCase();
  if (r.includes('reject')) return 'reject';
  if (r.includes('minor')) return 'accept_with_revisions';
  if (r.includes('revise') || r.includes('revision')) return 'revise';
  if (r.includes('accept')) return 'accept';
  return 'pending';
}

const config: Record<RecommendationStatus, {
  label: string; cls: string; Icon: typeof CheckCircle;
}> = {
  accept:               { label: 'Accept',                    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200',  Icon: CheckCircle },
  accept_with_revisions:{ label: 'Accept with Revisions',     cls: 'bg-sky-50 text-sky-700 ring-sky-200',             Icon: Edit        },
  revise:               { label: 'Major Revision Required',   cls: 'bg-amber-50 text-amber-700 ring-amber-200',       Icon: AlertCircle  },
  reject:               { label: 'Reject',                    cls: 'bg-rose-50 text-rose-700 ring-rose-200',          Icon: XCircle     },
  pending:              { label: 'Pending Review',            cls: 'bg-slate-100 text-slate-600 ring-slate-200',      Icon: Clock       },
};

export default function RecommendationBadge({ recommendation, size = 'md' }: Props) {
  const status = classify(recommendation);
  const { label, cls, Icon } = config[status];
  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${cls} ${pad}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
}
