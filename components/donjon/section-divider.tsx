interface SectionDividerProps {
  title?: string;
  className?: string;
}

export function SectionDivider({ title, className = "" }: SectionDividerProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`.trim()}>
      {title && (
        <span className="fira-label uppercase shrink-0">{title}</span>
      )}
      <div className="neon-line flex-1" />
    </div>
  );
}
