"use client";

import { ReactNode } from "react";

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[10%] w-16 h-16 opacity-20 animate-float-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-sky-400">
          <polygon
            points="50,5 93.3,25 93.3,75 50,95 6.7,75 6.7,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      <div className="absolute top-40 right-[15%] w-24 h-24 opacity-15 animate-float-reverse">
        <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-400">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 5" />
        </svg>
      </div>
      
      <div className="absolute bottom-32 left-[20%] w-12 h-12 opacity-15 animate-spin-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      
      <div className="absolute top-60 right-[25%] w-8 h-8 opacity-20 animate-pulse-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-violet-400">
          <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      
      <div className="absolute bottom-48 right-[10%] w-6 h-6 opacity-25 animate-float-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-sky-400">
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="3" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      
      <div className="absolute top-32 left-[30%] opacity-20">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-sky-400">
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="2" fill="currentColor" />
            ))
          )}
        </svg>
      </div>
    </div>
  );
}

interface SectionSeparatorProps {
  icon?: ReactNode;
  variant?: "default" | "gradient" | "dots";
}

export function SectionSeparator({ icon, variant = "default" }: SectionSeparatorProps) {
  if (variant === "dots") {
    return (
      <div className="w-full py-12 flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-full bg-sky-400/30" />
        <span className="w-2 h-2 rounded-full bg-sky-400/50" />
        <span className="w-3 h-3 rounded-full bg-sky-400" />
        <span className="w-2 h-2 rounded-full bg-sky-400/50" />
        <span className="w-2 h-2 rounded-full bg-sky-400/30" />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="w-full py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
        {icon && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#030712] p-3 rounded-full border border-white/10">
            {icon}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full py-8 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
      {icon && (
        <div className="p-2 rounded-full bg-white/5 border border-white/10">{icon}</div>
      )}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}

export function QuoteIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-10 h-10 ${className}`} viewBox="0 0 40 40" fill="none">
      <path
        d="M12 22H6C6 17 8 14 12 12V16C10 17 9 18.5 9 21V22H12V30H4V22H12ZM28 22H22C22 17 24 14 28 12V16C26 17 25 18.5 25 21V22H28V30H20V22H28Z"
        fill="currentColor"
        opacity="0.15"
      />
    </svg>
  );
}

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-white/10"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

interface GlowBorderProps {
  children: ReactNode;
  color?: "sky" | "indigo" | "emerald" | "violet";
  className?: string;
}

export function GlowBorder({ children, color = "sky", className = "" }: GlowBorderProps) {
  const colorClasses = {
    sky: "from-sky-500/50 via-sky-400/25 to-sky-500/50 shadow-sky-500/20",
    indigo: "from-indigo-500/50 via-indigo-400/25 to-indigo-500/50 shadow-indigo-500/20",
    emerald: "from-emerald-500/50 via-emerald-400/25 to-emerald-500/50 shadow-emerald-500/20",
    violet: "from-violet-500/50 via-violet-400/25 to-violet-500/50 shadow-violet-500/20",
  };

  return (
    <div className={`relative p-[2px] rounded-2xl bg-gradient-to-r ${colorClasses[color]} shadow-lg ${className}`}>
      <div className="bg-[#030712] rounded-2xl h-full">{children}</div>
    </div>
  );
}

export function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[140px] animate-pulse-slow animation-delay-2000" />
    </div>
  );
}

export function GridPattern({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

export function CircuitPattern({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none opacity-5 ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="circuit" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-sky-400" />
            <path d="M2 2 L10 2 L10 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sky-400" />
            <circle cx="10" cy="10" r="1" fill="currentColor" className="text-sky-400" />
            <path d="M10 10 L18 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sky-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}
