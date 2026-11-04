type ProgressBarProps = {
  value: number;
  className?: string;
  trackClassName?: string;
  label?: string;
};

export default function ProgressBar({
  value,
  className = "h-4",
  trackClassName = "mb-6 mt-3",
  label = "Progress",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`bg-track ${className} ${trackClassName}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
    >
      <div className="h-full bg-navy transition-all duration-300" style={{ width: `${clamped}%` }} />
    </div>
  );
}
