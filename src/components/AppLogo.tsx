import React, { useState } from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  withGlow?: boolean;
  variant?: 'image' | 'vector';
}

const SIZE_MAP = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = false,
  variant = 'image'
}) => {
  const [imgError, setImgError] = useState(false);
  const pxSize = typeof size === 'number' ? size : SIZE_MAP[size];

  // If image variant is requested and successfully loads, render high-res logo image
  if (variant === 'image' && !imgError) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-hidden ${
          withGlow ? 'shadow-[0_0_24px_rgba(255,115,0,0.35)] ring-1 ring-orange-500/30' : ''
        } ${className}`}
        style={{ width: pxSize, height: pxSize }}
      >
        <img
          src="/logo.png"
          alt="Model Match AI Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Pure SVG Vector Mark exactly matching the logo design
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${
        withGlow ? 'shadow-[0_0_24px_rgba(255,115,0,0.4)] ring-1 ring-orange-500/40' : ''
      } ${className}`}
      style={{ width: pxSize, height: pxSize }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-full"
        aria-label="Model Match AI"
      >
        {/* Dark Circle Canvas */}
        <circle cx="50" cy="50" r="49" fill="#06070A" stroke="#1F232E" strokeWidth="1.5" />

        {/* Left Arm: Descends from top-left, curves at bottom left, hooks up into acute V */}
        <path
          d="M 22 13 L 41 82 L 53 66"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-Center White Pill */}
        <path
          d="M 48 10 L 53 30"
          stroke="#FFFFFF"
          strokeWidth="10.5"
          strokeLinecap="round"
        />

        {/* Central Vivid Orange Ring (Discovery Lens) */}
        <circle
          cx="56"
          cy="49"
          r="14"
          stroke="#FF7300"
          strokeWidth="9"
          fill="none"
        />

        {/* Right Arm: Descends from top-right, contours past orange ring to bottom-right */}
        <path
          d="M 76 13 C 71 28, 65 39, 64 47 C 63 55, 65 65, 75 90"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />

        {/* Orange Apex Accent Dot inside top-right rounded cap */}
        <circle
          cx="76"
          cy="13"
          r="3.4"
          fill="#FF7300"
        />
      </svg>
    </div>
  );
};
