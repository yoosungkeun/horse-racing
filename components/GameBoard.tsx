import React from 'react';
import type { Horse } from '../types';
import HorseIcon from './HorseIcon';

interface GameBoardProps {
  horses: Horse[];
}

const GameBoard: React.FC<GameBoardProps> = ({ horses }) => {
  return (
    <div className="w-full bg-green-800 border-8 border-yellow-600 shadow-2xl p-4 sm:p-6 rounded-lg relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #166534 0%, #14532d 100%)' }}>
      <div className="absolute inset-0 bg-repeat opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="space-y-2 relative">
        {horses.map((horse, index) => (
          <div key={horse.id} className="relative h-12 bg-yellow-900/50 rounded-md overflow-hidden">
            <div 
                className="absolute h-full bg-black/20" 
                style={{
                    width: '100%',
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 12px)',
                }}
            />
            <div
              className="absolute top-0 h-full transition-all duration-100 ease-linear flex items-center"
              style={{ left: `calc(${horse.position}% - 1.5rem)` }} // Adjust for horse width
            >
                <HorseIcon color={horse.color} number={horse.id + 1} />
            </div>
          </div>
        ))}
      </div>
       <div className="absolute top-0 right-8 bottom-0 w-2 bg-white/80" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 10px, #fff 10px, #fff 20px)'
       }}>
        <div className="absolute -top-4 -left-10 text-white font-bungee text-2xl transform -rotate-90 origin-bottom-left">FINISH</div>
       </div>
    </div>
  );
};

export default GameBoard;
