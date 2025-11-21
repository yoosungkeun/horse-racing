
export enum GameState {
  Setup = 'setup',
  Betting = 'betting',
  Racing = 'racing',
  Finished = 'finished',
  GameOver = 'gameOver',
}

export interface Horse {
  id: number;
  color: string;
  textColor: string;
  name: string;
  position: number;
}

export interface Player {
  id: number;
  name: string;
  balance: number;
  betOnHorseId: number | null;
  betAmount: number;
}