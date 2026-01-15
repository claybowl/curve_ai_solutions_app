import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  const baseClasses = "glass-panel";
  const hoverClasses = hover ? "data-card" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`.trim()}>
      {children}
    </div>
  );
}
