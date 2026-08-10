interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: Props) {
  const s = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' }[size];
  return (
    <span
      className={`inline-block rounded-full border-primary-200 border-t-primary-600 animate-spin ${s} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
