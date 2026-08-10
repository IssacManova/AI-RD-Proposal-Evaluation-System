interface Props {
  status: string;
}

function getConfig(status: string): { label: string; cls: string } {
  const s = status.toLowerCase();
  if (s === 'evaluated' || s === 'completed') return { label: 'Evaluated', cls: 'badge-emerald' };
  if (s === 'pending')    return { label: 'Pending',   cls: 'badge-amber' };
  if (s === 'processing') return { label: 'Processing', cls: 'badge-sky' };
  if (s === 'failed')     return { label: 'Failed',    cls: 'badge-rose' };
  return { label: status, cls: 'badge-slate' };
}

export default function StatusBadge({ status }: Props) {
  const { label, cls } = getConfig(status);
  return <span className={cls}>{label}</span>;
}
