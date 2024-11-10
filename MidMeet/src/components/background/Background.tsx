import "./background.css";
import { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <div>
      <svg
        id="eclipse1"
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 544 629"
        fill="none"
      >
        <path d="M544 -8C544 343.805 220.302 629 -179 629C-578.302 629 -902 343.805 -902 -8C-902 -359.805 -578.302 -645 -179 -645C220.302 -645 544 -359.805 544 -8Z" />
      </svg>
      <svg
        id="eclipse2"
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="300"
        viewBox="0 0 544 629"
        fill="none"
      >
        <path d="M544 -8C544 343.805 220.302 629 -179 629C-578.302 629 -902 343.805 -902 -8C-902 -359.805 -578.302 -645 -179 -645C220.302 -645 544 -359.805 544 -8Z" />
      </svg>
      <svg
        id="eclipse3"
        xmlns="http://www.w3.org/2000/svg"
        width="400"
        height="400"
        viewBox="0 0 544 629"
        fill="none"
      >
        <path d="M544 -8C544 343.805 220.302 629 -179 629C-578.302 629 -902 343.805 -902 -8C-902 -359.805 -578.302 -645 -179 -645C220.302 -645 544 -359.805 544 -8Z" />
      </svg>
      <svg
        id="eclipse4"
        width="1000"
        height="1000"
        viewBox="0 -500 300 1500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="800" cy="500" rx="500" ry="500" />
      </svg>
      <svg
        id="eclipse5"
        width="1200"
        height="1200"
        viewBox="0 -300 300 1500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="800" cy="500" rx="500" ry="500" />
      </svg>
      <svg
        id="eclipse6"
        width="1400"
        height="1400"
        viewBox="0 -200 300 1500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="800" cy="500" rx="500" ry="500" />
      </svg>
      {children}
    </div>
  );
}
