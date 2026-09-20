import React from 'react';
import { useApp } from '../context/AppContext';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewportMode } = useApp();

  let widthClass = 'max-w-[390px]';
  let heightClass = 'min-h-[844px]';

  if (viewportMode === '430x932') {
    widthClass = 'max-w-[430px]';
    heightClass = 'min-h-[932px]';
  } else if (viewportMode === '360x800') {
    widthClass = 'max-w-[360px]';
    heightClass = 'min-h-[800px]';
  } else if (viewportMode === 'fluid') {
    widthClass = 'max-w-2xl';
    heightClass = 'min-h-screen';
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-0 sm:py-6 sm:px-4">
      {/* Phone Outer Shell */}
      <div 
        className={`w-full ${widthClass} ${heightClass} bg-[#111318] text-[#f0f2f5] flex flex-col relative sm:rounded-[36px] sm:border-[5px] sm:border-[#20232B] sm:shadow-2xl sm:shadow-black/80 overflow-hidden`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px -10px rgba(124, 77, 255, 0.15)'
        }}
      >
        {/* Dynamic Island / Speaker Pill for mobile realism */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#090a0f] rounded-full z-40 items-center justify-end px-2 border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1e2330] border border-blue-500/20" />
        </div>

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-20 relative">
          {children}
        </div>
      </div>
    </div>
  );
};
