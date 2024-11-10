import { ReactNode } from "react";
import "./card.css";

interface CardProps {
  className?: string;
  logo?: boolean;
  children: ReactNode;
}

export default function Card({
  className = "",
  logo = false,
  children,
}: CardProps) {
  return (
    <div className={`myCard ${className}`.trim()}>
      {logo && <img src="/logo.svg" className="logo" />}

      {children}
    </div>
  );
}
