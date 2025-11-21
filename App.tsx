
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Horse, Player } from './types';
import { GameState } from './types';
import { INITIAL_HORSES, TRACK_LENGTH, RACE_INTERVAL, MAX_STEP, INITIAL_PLAYER_BALANCE, WIN_PAYOUT_MULTIPLIER } from './constants';
import GameBoard from './components/GameBoard';
import BettingChip from './components/BettingChip';
import LanguageSwitcher from './components/LanguageSwitcher';
import { translations, Language } from './translations';

const App: React.FC = () => {
  const [horses, setHorses] = useState<Horse[]>(INITIAL_HORSES);
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [players, setPlayers] = useState<Player[]>([]);
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [bettingPlayerIndex, setBettingPlayerIndex] = useState<number>(0);
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('10');
  const [language, setLanguage] = useState<Language>('ko');

  const [winner, setWinner] = useState<Horse | null>(null);

  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  const t = (key: keyof typeof translations) => translations[key][language];

  const handleSetNumPlayers = (count: number) => {
    setNumPlayers(count);
    const newPlayers = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: `${t('player')} ${i + 1}`,
      balance: INITIAL_PLAYER_BALANCE,
      betOnHorseId: null,
      betAmount: 0,
    }));
    setPlayers(newPlayers);
    setGameState(GameState.Betting);
  };

  const resetForNewRound = useCallback(() => {
    setHorses(INITIAL_HORSES.map(h => ({ ...h, position: 0 })));
    setGameState(GameState.Betting);

    const playersWithResetBets = players.map(p => ({
      ...p,
      betOnHorseId: null,
      betAmount: 0
    }));
    
    const firstActivePlayerIndex = playersWithResetBets.findIndex(p => p.balance > 0);

    setPlayers(playersWithResetBets);
    setBettingPlayerIndex(firstActivePlayerIndex !== -1 ? firstActivePlayerIndex : 0);
    setSelectedHorseId(null);
    setBetAmount('10');
    setWinner(null);

    lastUpdateTime.current = 0;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [players]);

  const restartGame = () => {
    setHorses(INITIAL_HORSES.map(h => ({ ...h, position: 0 })));
    setGameState(GameState.Setup);
    setPlayers([]);
    setBettingPlayerIndex(0);
    setSelectedHorseId(null);
    setBetAmount('10');
    setWinner(null);
    lastUpdateTime.current = 0;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };
  
  const runRace = useCallback((timestamp: number) => {
    if (gameState !== GameState.Racing) return;

    if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;
    const deltaTime = timestamp - lastUpdateTime.current;

    let raceWinner: Horse | null = null;

    if (deltaTime > RACE_INTERVAL) {
      lastUpdateTime.current = timestamp;
      
      const nextHorses = horses.map(horse => {
        if (horse.position >= TRACK_LENGTH) return horse;
        const newPosition = Math.min(TRACK_LENGTH, horse.position + Math.random() * MAX_STEP);
        if (newPosition >= TRACK_LENGTH && !raceWinner) {
          raceWinner = { ...horse, position: TRACK_LENGTH };
        }
        return { ...horse, position: newPosition };
      });
      setHorses(nextHorses);
      
      if (raceWinner) {
        setWinner(raceWinner);
        setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map(player => {
                if (player.betOnHorseId === raceWinner!.id) {
                  return { ...player, balance: player.balance + player.betAmount * (WIN_PAYOUT_MULTIPLIER - 1) };
                } else if (player.betOnHorseId !== null) {
                  return { ...player, balance: player.balance - player.betAmount };
                }
                return player;
            });

            const activePlayers = updatedPlayers.filter(p => p.balance > 0);
            if (activePlayers.length <= (prevPlayers.length > 1 ? 1 : 0)) {
                setGameState(GameState.GameOver);
            } else {
                setGameState(GameState.Finished);
            }
            return updatedPlayers;
        });
      }
    }

    if (!raceWinner) {
        animationFrameId.current = requestAnimationFrame(runRace);
    }
  }, [horses, gameState]);

  useEffect(() => {
    if (gameState === GameState.Racing) {
      animationFrameId.current = requestAnimationFrame(runRace);
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, runRace]);

  const handlePlaceBet = () => {
    const amount = parseInt(betAmount, 10);
    const currentPlayer = players[bettingPlayerIndex];
    if (selectedHorseId === null || isNaN(amount) || amount <= 0 || amount > currentPlayer.balance) {
      return;
    }
    
    const newPlayers = players.map((p, index) => 
      index === bettingPlayerIndex 
        ? { ...p, betOnHorseId: selectedHorseId, betAmount: amount } 
        : p
    );

    const nextPlayerIndex = newPlayers.findIndex(
      (p, idx) => idx > bettingPlayerIndex && p.balance > 0
    );

    if (nextPlayerIndex !== -1) {
      setBettingPlayerIndex(nextPlayerIndex);
      setSelectedHorseId(null);
      setBetAmount('10');
    }

    setPlayers(newPlayers);
  };
  
  const allBetsPlaced = players.length > 0 && players.every(p => p.balance <= 0 || p.betOnHorseId !== null);
  
  const handleStartRace = () => {
    if (allBetsPlaced) {
      setGameState(GameState.Racing);
    }
  };
  
  const currentPlayer = players[bettingPlayerIndex];

  const renderContent = () => {
    switch(gameState) {
      case GameState.Setup:
        return (
            <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4">{t('howManyPlayers')}</h2>
                <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <button key={n} onClick={() => handleSetNumPlayers(n)} className="font-bungee text-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold w-16 h-16 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-110">
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        )
      case GameState.Betting:
        if (!currentPlayer || currentPlayer.balance <= 0) {
            return null; // Don't show betting UI if current player is spectating
        }
        return (
            <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-center text-2xl font-bold mb-2">
                    {`${t('placeYourBet')} ${currentPlayer.name}`}
                </h3>
                <p className="text-center text-lg text-yellow-400 mb-4">{t('balancePoints')} {currentPlayer.balance} {t('points')}</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                    <input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="w-32 text-center bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-xl" />
                    <button onClick={handlePlaceBet} disabled={selectedHorseId === null || !!currentPlayer.betOnHorseId} className="font-bungee text-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed">
                      {currentPlayer.betOnHorseId !== null ? t('betPlaced') : t('placeBet')}
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                {INITIAL_HORSES.map(horse => (
                    <BettingChip
                    key={horse.id}
                    horse={horse}
                    onSelect={setSelectedHorseId}
                    isSelected={selectedHorseId === horse.id}
                    isDisabled={!!currentPlayer.betOnHorseId}
                    />
                ))}
                </div>
            </div>
        )
      case GameState.Finished:
         return (
            <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-yellow-400 w-full">
                <h2 className="text-3xl font-bold mb-2">{t('raceFinished')}</h2>
                <p className="text-xl mb-4">
                    <span className="text-yellow-400 font-bold">{t('horse')}{winner ? winner.id + 1 : ''}</span> {t('isTheWinner')}
                </p>
                <div className="space-y-2">
                    {players.map(player => {
                        const playerWon = player.betOnHorseId === winner?.id;
                        return (
                            <div key={player.id} className={`p-2 rounded-md ${playerWon ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                <p className="text-lg">
                                    <span className="font-bold">{player.name}:</span>
                                    {player.betOnHorseId !== null ?
                                     ` ${t(playerWon ? 'andWon' : 'andLost').replace('{horseNumber}', (player.betOnHorseId + 1).toString())} ${player.betAmount} ${t(playerWon ? 'pointsWonSuffix' : 'pointsLostSuffix')}`
                                     : ` ${t('didntBet')}`}
                                    <span className="font-bold ml-2">{t('newBalance')} {player.balance}</span>
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
      case GameState.GameOver:
        const finalWinner = players.find(p => p.balance > 0);
        return (
           <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-yellow-400 w-full">
               <h2 className="text-3xl font-bungee text-red-500 mb-2">{t('gameOver')}</h2>
               {finalWinner ? (
                   <p className="text-2xl mb-4 text-yellow-300">
                       {t('finalWinnerIs')} <span className="font-bold">{finalWinner.name}</span>!
                   </p>
               ) : (
                   <p className="text-2xl mb-4 text-gray-400">{t('noWinner')}</p>
               )}
               
               <div className="border-t border-gray-600 my-4"></div>

               <h3 className="text-xl font-bold mb-2">{t('finalRoundResults')}</h3>
               <p className="text-lg mb-4">
                   <span className="text-yellow-400 font-bold">{t('horse')}{winner ? winner.id + 1 : ''}</span> {t('isTheWinner')}
               </p>
               <div className="space-y-2">
                   {players.map(player => {
                       const playerWon = player.betOnHorseId === winner?.id;
                       return (
                           <div key={player.id} className={`p-2 rounded-md ${playerWon ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                               <p className="text-lg">
                                   <span className="font-bold">{player.name}:</span>
                                   {player.betOnHorseId !== null ?
                                    ` ${t(playerWon ? 'andWon' : 'andLost').replace('{horseNumber}', (player.betOnHorseId + 1).toString())} ${player.betAmount} ${t(playerWon ? 'pointsWonSuffix' : 'pointsLostSuffix')}`
                                    : ` ${t('didntBet')}`}
                                   <span className="font-bold ml-2">{t('newBalance')} {player.balance}</span>
                               </p>
                           </div>
                       )
                   })}
               </div>
           </div>
       )
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <header className="w-full relative text-center">
            <div className="absolute top-0 right-0">
                <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
          <h1 className="font-bungee text-5xl sm:text-7xl text-yellow-400" style={{ textShadow: '3px 3px 0px #ef4444' }}>
            {t('geeWiz')}
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 tracking-wider">{t('racingGameSensation')}</p>
        </header>

        {players.length > 0 && (
            <div className="w-full bg-gray-800 p-2 rounded-lg shadow-lg">
                <div className="flex justify-around">
                    {players.map(p => {
                        const isSpectating = p.balance <= 0;
                        return (
                            <div key={p.id} className={`text-center p-2 rounded transition-opacity duration-300 ${bettingPlayerIndex === p.id && gameState === GameState.Betting && !allBetsPlaced ? 'bg-yellow-500/20' : ''} ${isSpectating ? 'opacity-50' : ''}`}>
                                <p className="font-bold">{p.name}</p>
                                <p className="text-sm text-gray-400">{t('balance')}: {p.balance}</p>
                                <p className="text-sm text-yellow-300 h-5">
                                    {isSpectating 
                                        ? t('spectating')
                                        : p.betOnHorseId !== null 
                                            ? t('betDisplay')
                                                .replace('{amount}', p.betAmount.toString())
                                                .replace('{horseNumber}', (p.betOnHorseId + 1).toString())
                                            : t('noBet')}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )}

        <GameBoard horses={horses} />
        
        {renderContent()}

        <div className="flex justify-center h-16">
            {gameState === GameState.Betting && allBetsPlaced && (
                 <button onClick={handleStartRace} className="font-bungee text-2xl bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105">
                    {t('startRace')}
                </button>
            )}
            {gameState === GameState.Finished && (
                <button onClick={resetForNewRound} className="font-bungee text-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105">
                    {t('nextRound')}
                </button>
            )}
            {gameState === GameState.GameOver && (
                <button onClick={restartGame} className="font-bungee text-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105">
                    {t('playAgain')}
                </button>
            )}
        </div>

        <footer className="text-gray-500 text-center text-sm pt-4">
            {t('footer')}
        </footer>
      </div>
    </div>
  );
};

export default App;
