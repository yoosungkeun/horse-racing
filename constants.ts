import type { Horse } from './types';

export const HORSES_CONFIG = [
  { color: 'bg-red-500', textColor: 'text-red-500' },
  { color: 'bg-blue-500', textColor: 'text-blue-500' },
  { color: 'bg-yellow-400', textColor: 'text-yellow-400' },
  { color: 'bg-white', textColor: 'text-black' },
  { color: 'bg-gray-400', textColor: 'text-black' },
  { color: 'bg-green-500', textColor: 'text-green-500' },
];

export const INITIAL_HORSES: Horse[] = HORSES_CONFIG.map((config, index) => ({
  id: index,
  color: config.color,
  textColor: config.textColor,
  name: `Horse #${index + 1}`,
  position: 0,
}));

export const TRACK_LENGTH = 100;
export const RACE_INTERVAL = 75; // ms
export const MAX_STEP = 2.5;
export const INITIAL_PLAYER_BALANCE = 1000;
export const WIN_PAYOUT_MULTIPLIER = 5;