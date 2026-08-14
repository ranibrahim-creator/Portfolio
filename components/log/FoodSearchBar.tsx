"use client";

import { ScanLine, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onScan: () => void;
};

export function FoodSearchBar({ value, onChange, onScan }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-background pb-3 pt-1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search koshari, ful, yogurt..."
          className="pl-11 pr-12"
        />
        <button
          type="button"
          onClick={onScan}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-accent"
          aria-label="Scan barcode"
        >
          <ScanLine className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
