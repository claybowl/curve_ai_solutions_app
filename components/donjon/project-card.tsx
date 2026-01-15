interface ProjectTag {
  label: string;
  color: "sky" | "emerald" | "indigo" | "violet" | "pink" | "amber";
}

interface ProjectCardProps {
  code: string;
  codeColor?: string;
  title: string;
  description: string;
  tags: ProjectTag[];
  className?: string;
}

export function ProjectCard({
  code,
  codeColor = "text-sky-400",
  title,
  description,
  tags,
  className = "",
}: ProjectCardProps) {
  return (
    <div className={`glass-panel data-card p-6 ${className}`.trim()}>
      <span className={`fira-label ${codeColor}`}>{code}</span>
      <h3 className="text-xl font-semibold text-white mt-2 mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
        {tags.map((tag, index) => (
          <span key={index} className={`tech-tag tech-tag-${tag.color}`}>
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}
