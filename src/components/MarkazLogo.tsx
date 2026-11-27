import React from 'react';

export const MarkazLogo: React.FC<{ className?: string; size?: 'sm' | 'md' }> = ({
  className = '',
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'h-6 w-7' : 'h-7 w-8';
  const textSize = size === 'sm' ? 'text-[19px]' : 'text-[22px]';

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 36 30"
        fill="none"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <path
          d="M5 6.5V22.5C5 24.1 6.3 25.4 7.9 25.4C9.1 25.4 10.1 24.7 10.6 23.6L16.2 13.8"
          stroke="#7FE03E"
          strokeWidth="6.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.8 14.2L19.4 20.6C20.2 22 22.1 22 22.9 20.6L30.8 6.8"
          stroke="#21B65A"
          strokeWidth="6.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30.8 6.8V22.5"
          stroke="#21B65A"
          strokeWidth="6.2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-display ${textSize} font-extrabold tracking-tight text-[#1E293B]`}
      >
        Markaz
      </span>
    </span>
  );
};
