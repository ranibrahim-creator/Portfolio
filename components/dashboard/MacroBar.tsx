type MacroKey = "protein" | "carbs" | "fat";

type Props = {
  label: string;
  value: number;
  goal: number;
  macro: MacroKey;
  delay?: number;
};

const MACRO_COLORS: Record<MacroKey, string> = {
  protein: "#2DC9A6",
  carbs: "#9B8AFB",
  fat: "#F5B942",
};

export function MacroBar({ label, value, goal, macro, delay = 0 }: Props) {
  const ratio = goal <= 0 ? 0 : Math.min(value / goal, 1);
  const color = MACRO_COLORS[macro];

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
        </div>
        <p className="text-sm font-medium tabular-nums">
          {Math.round(value)}
          <span className="text-muted">/{goal}g</span>
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full max-w-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${ratio * 100}%`, backgroundColor: color, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
