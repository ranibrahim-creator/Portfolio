"use client";

import { mockWeeklyCalories, mockWeightTrend } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { formatKcal } from "@/lib/utils";

export default function ProgressPage() {
  const { user } = useApp();
  const weeklyAvg = Math.round(
    mockWeeklyCalories.reduce((sum, day) => sum + day.kcal, 0) / mockWeeklyCalories.length,
  );
  const latestWeight = mockWeightTrend[mockWeightTrend.length - 1];
  const startWeight = mockWeightTrend[0];
  const delta = Number((latestWeight.kg - startWeight.kg).toFixed(1));

  return (
    <main className="px-5 pb-28 pt-6">
      <h1 className="text-2xl font-semibold">Progress</h1>
      <p className="mt-1 text-sm text-muted">Last 8 weeks · {user.name}</p>

      <section className="mt-6 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Weight</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{latestWeight.kg.toFixed(1)} kg</p>
          </div>
          <p className={`text-sm font-medium tabular-nums ${delta < 0 ? "text-protein" : "text-muted"}`}>
            {delta > 0 ? "+" : ""}
            {delta} kg
          </p>
        </div>
        <div className="mt-4">
          <WeightChart />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Weekly calorie average</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{formatKcal(weeklyAvg)}</p>
        <p className="text-sm text-muted">kcal / day · goal {formatKcal(user.calorieGoal)}</p>
        <div className="mt-5 flex items-end gap-2">
          {mockWeeklyCalories.map((day) => {
            const ratio = Math.min(day.kcal / Math.max(user.calorieGoal * 1.25, 1), 1);
            const over = day.kcal > user.calorieGoal;
            return (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-border/60">
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: `${Math.max(ratio * 100, 8)}%`,
                      backgroundColor: over ? "#E24B4A" : "#FF8A5B",
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted">{day.day}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function WeightChart() {
  const width = 400;
  const height = 168;
  const pad = { t: 12, r: 8, b: 28, l: 36 };
  const values = mockWeightTrend.map((point) => point.kg);
  const min = Math.min(...values) - 0.4;
  const max = Math.max(...values) + 0.4;
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const x = (index: number) => pad.l + (index / (mockWeightTrend.length - 1)) * innerW;
  const y = (kg: number) => pad.t + (1 - (kg - min) / (max - min)) * innerH;
  const path = mockWeightTrend
    .map((point, index) => `${index === 0 ? "M" : "L"} ${x(index).toFixed(1)} ${y(point.kg).toFixed(1)}`)
    .join(" ");
  const area = `${path} L ${x(mockWeightTrend.length - 1).toFixed(1)} ${pad.t + innerH} L ${x(0).toFixed(1)} ${pad.t + innerH} Z`;
  const ticks = [max, (max + min) / 2, min];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label="Weight trend">
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={pad.l}
            x2={width - pad.r}
            y1={y(tick)}
            y2={y(tick)}
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
          />
          <text x={0} y={y(tick) + 4} className="fill-muted text-[10px]" fontSize="10">
            {tick.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={area} fill="#FF8A5B" fillOpacity="0.12" />
      <path d={path} fill="none" stroke="#FF8A5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {mockWeightTrend.map((point, index) => (
        <circle key={point.date} cx={x(index)} cy={y(point.kg)} r="3.5" fill="#FF8A5B" />
      ))}
      <text x={x(0)} y={height - 6} className="fill-muted text-[10px]" fontSize="10">
        {mockWeightTrend[0].date}
      </text>
      <text
        x={x(mockWeightTrend.length - 1)}
        y={height - 6}
        textAnchor="end"
        className="fill-muted text-[10px]"
        fontSize="10"
      >
        {mockWeightTrend[mockWeightTrend.length - 1].date}
      </text>
    </svg>
  );
}
