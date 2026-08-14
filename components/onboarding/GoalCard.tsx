"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: () => void;
};

export function GoalCard({ label, description, icon: Icon, selected, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      animate={{ scale: selected ? 1.05 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full items-center gap-4 rounded-xl border p-6 text-left transition-colors duration-200 ease-out ${
        selected ? "border-accent bg-surface" : "border-border bg-surface"
      }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected ? "bg-white text-black" : "border border-border text-foreground"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-base font-semibold">{label}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </motion.button>
  );
}
