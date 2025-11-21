import React from 'react';

interface HorseIconProps {
  color: string;
  number: number;
}

const HorseIcon: React.FC<HorseIconProps> = ({ color, number }) => {
  const bgColorClass = color.startsWith('bg-') ? color : `bg-${color}`;
  
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <span className="text-4xl drop-shadow-lg transform -scale-x-100" role="img" aria-label={`Horse ${number}`}>🐎</span>
      <div className={`absolute top-4 right-10 w-5 h-5 rounded-full flex items-center justify-center ${bgColorClass} ring-1 ring-white/50`}>
        <span className="text-black text-xs font-bold">{number}</span>
      </div>
    </div>
  );
};

export default HorseIcon;