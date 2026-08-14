"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type Props = {
  consumed: number;
  goal: number;
  size?: number;
  animateFromZero?: boolean;
};

export function CalorieRing({ consumed, goal, size = 220, animateFromZero = true }: Props) {
  const progress = goal <= 0 ? 0 : Math.min(consumed / goal, 1);
  const remaining = Math.max(0, Math.round(goal - consumed));
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const spring = useSpring(animateFromZero ? 0 : progress, {
    stiffness: 80,
    damping: 18,
    mass: 0.8,
  });

  useEffect(() => {
    spring.set(progress);
  }, [progress, spring]);

  const dashOffset = useTransform(spring, (value) => circumference * (1 - value));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#059669"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Remaining</p>
        <p className="text-4xl font-bold tabular-nums leading-none">{remaining.toLocaleString()}</p>
        <p className="mt-1 text-sm text-muted">kcal</p>
      </div>
    </div>
  );
}
