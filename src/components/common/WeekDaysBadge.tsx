import './WeekDaysBadge.css';

interface WeekDaysBadgeProps {
  days: string[];
  size?: 'small' | 'medium' | 'large';
}

const dayLabels: Record<string, string> = {
  seg: 'S',
  ter: 'T',
  qua: 'Q',
  qui: 'Q',
  sex: 'S',
  sab: 'S',
  dom: 'D',
};

const dayFullNames: Record<string, string> = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
  dom: 'Domingo',
};

export function WeekDaysBadge({ days, size = 'medium' }: WeekDaysBadgeProps) {
  const allDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

  return (
    <div className={`week-days-badge week-days-badge--${size}`}>
      {allDays.map((day) => (
        <span
          key={day}
          className={`day-badge ${days.includes(day) ? 'active' : ''}`}
          title={dayFullNames[day]}
        >
          {dayLabels[day]}
        </span>
      ))}
    </div>
  );
}
