"use client";

import { ReactNode } from "react";

interface SynapseBackgroundProps {
  children?: ReactNode;
}

export function SynapseBackground({ children }: SynapseBackgroundProps) {
  return (
    <>
      {/* Ambient grid background */}
      <div className="ambient-bg fixed inset-0 -z-10" />
      
      {/* Floating glow orbs */}
      <div className="synapse-glow" style={{ top: "5%", left: "5%" }} />
      <div className="synapse-glow" style={{ top: "50%", right: "5%" }} />
      <div className="synapse-glow" style={{ top: "75%", left: "30%" }} />
      
      {/* Vignette overlay for depth */}
      <div className="vignette-overlay" />
      
      {children}
    </>
  );
}
