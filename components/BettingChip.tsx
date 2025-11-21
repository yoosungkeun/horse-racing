
import React from 'react';
import type { Horse } from '../types';

interface BettingChipProps {
  horse: Horse;
  onSelect: (id: number) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

const BettingChip: React.FC<BettingChipProps> = ({ horse, onSelect, isSelected, isDisabled }) => {
  return (
    <button
      onClick={() => onSelect(horse.id)}
      disabled={isDisabled}
      className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex-shrink-0 transition-all duration-300 transform focus:outline-none ${
        isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 focus:ring-4 focus:ring-yellow-300'
      } ${isSelected ? 'scale-110 ring-4 ring-yellow-300' : 'scale-100'}`}
    >
      <div className={`absolute inset-0 rounded-full ${horse.color} shadow-inner`}></div>
      <div className="absolute inset-1.5 rounded-full bg-gray-600 shadow-lg flex items-center justify-center">
        <span className={`font-bungee text-4xl md:text-5xl ${horse.textColor} drop-shadow-sm`}>
          {horse.id + 1}
        </span>
      </div>
    </button>
  );
};

export default BettingChip;
