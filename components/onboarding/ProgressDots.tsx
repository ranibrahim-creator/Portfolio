type Props = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-2 rounded-full transition-all duration-200 ease-out ${
            index === current ? "w-6 bg-accent" : "w-2 bg-border"
          }`}
        />
      ))}
    </div>
  );
}
