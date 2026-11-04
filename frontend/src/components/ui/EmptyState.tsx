type EmptyStateProps = {
  title: string;
  hint: string;
};

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="px-2 py-8 text-center text-[13px] text-mute">
      <b className="block text-[15px] font-semibold text-ink">{title}</b>
      {hint}
    </div>
  );
}
