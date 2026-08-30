import React from 'react';

const LogoIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="currentColor"
    >
      {/* Handle */}
      <path 
        d="M32 30 C 32 12, 68 12, 68 30" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />
      {/* Main Bag Body */}
      <path 
        d="M20 30 L80 30 C86 30 90 35 88 42 L82 86 C81 92 76 96 70 96 L30 96 C24 96 19 92 18 86 L12 42 C10 35 14 30 20 30 Z" 
      />
      {/* Left Eye (Dot) */}
      <circle cx="37" cy="50" r="4.5" fill="#ffffff" />
      {/* Right Eye (Wink Arc) */}
      <path 
        d="M58 50 Q 64 44 70 50" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      {/* Smile Arc */}
      <path 
        d="M35 62 Q 50 78 65 62" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default LogoIcon;