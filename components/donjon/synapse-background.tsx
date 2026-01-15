"use client";

import { ReactNode } from "react";

interface SynapseBackgroundProps {
  children?: ReactNode;
}

export function SynapseBackground({ children }: SynapseBackgroundProps) {
  return (
    <>
      <div className="synapse-glow" style={{ top: "10%", left: "10%" }} />
      <div className="synapse-glow" style={{ top: "60%", right: "5%" }} />
      <div className="synapse-glow" style={{ top: "80%", left: "40%" }} />
      {children}
    </>
  );
}
