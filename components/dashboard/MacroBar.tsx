type Props = {
  label: string;
  value: number;
  goal: number;
  delay?: number;
};

export function MacroBar({ label, value, goal, delay = 0 }: Props) {
  const ratio = goal <= 0 ? 0 : Math.min(value / goal, 1);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="text-sm font-medium tabular-nums">
          {Math.round(value)}
          <span className="text-muted">/{goal}g</span>
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${ratio * 100}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
