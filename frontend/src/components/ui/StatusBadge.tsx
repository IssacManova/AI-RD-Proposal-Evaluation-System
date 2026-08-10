interface Props {
  status: string;
}

function getConfig(status: string): { label: string; cls: string } {
  const s = status.toLowerCase().replace(/[_\s-]/g, '-');

  // AI processing states
  if (s === 'evaluated' || s === 'completed')        return { label: 'AI Evaluated',          cls: 'badge-emerald' };
  if (s === 'awaiting-ai' || s === 'pending')        return { label: 'Awaiting AI Evaluation', cls: 'badge-amber'   };
  if (s === 'processing')                            return { label: 'Processing',             cls: 'badge-sky'     };
  if (s === 'failed')                                return { label: 'Evaluation Failed',      cls: 'badge-rose'    };

  // Human review states
  if (s === 'reviewed' || s === 'human-reviewed')    return { label: 'Reviewed',               cls: 'badge-sky'     };
  if (s === 'awaiting-review')                       return { label: 'Awaiting Review',        cls: 'badge-amber'   };
  if (s === 'not-applicable' || s === 'na')          return { label: '—',                      cls: 'badge-slate'   };

  // Final decision states
  if (s === 'accept' || s === 'accepted')            return { label: 'Accepted',               cls: 'badge-emerald' };
  if (s === 'reject' || s === 'rejected')            return { label: 'Rejected',               cls: 'badge-rose'    };
  if (s === 'revise' || s === 'revision-requested' || s === 'accept-with-revisions')
                                                     return { label: 'Revision',               cls: 'badge-amber'   };

  return { label: status, cls: 'badge-slate' };
}

export default function StatusBadge({ status }: Props) {
  const { label, cls } = getConfig(status);
  return <span className={cls}>{label}</span>;
}
