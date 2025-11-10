import './Badge.css';

interface BadgeProps {
  label: string;
  tone?: 'default' | 'positive' | 'warning';
}

export function Badge({ label, tone = 'default' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}
