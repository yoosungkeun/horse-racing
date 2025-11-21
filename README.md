
# Gee-Wiz Horse Racing Game

A retro-style virtual horse racing game inspired by the classic "Gee-Wiz" mechanical toy. This web-based application brings the nostalgic thrill of the race track to your browser, allowing multiple players to bet on their favorite horses and watch the race unfold in real-time.

## 🌟 Key Features

- **Multiplayer Support:** Play with 1 to 6 friends.
- **Betting System:** Each player starts with a balance to place bets on the horse they believe will win.
- **Dynamic Race Animation:** A smooth, `requestAnimationFrame`-powered race simulation provides an engaging visual experience.
- **Payouts:** Winning bets receive a payout, adding a strategic element to the game.
- **Retro-Inspired UI:** Styled with Tailwind CSS and the "Bungee" font to capture a vintage arcade feel.
- **Play Again:** Easily start a new round after a race finishes to keep the fun going.

## 🎮 How to Play

1.  **Select Players:** Start by choosing the number of players (1-6).
2.  **Place Bets:** Each player takes a turn to bet:
    - Click on a numbered **Betting Chip** to select a horse.
    - Enter the amount you wish to wager in the input field.
    - Click the **"Place Bet"** button to confirm.
3.  **Start the Race:** Once all players have placed their bets, the **"Start Race"** button will appear. Click it to begin!
4.  **Watch the Race:** The horses will dash across the screen towards the finish line. Their progress is randomized for an unpredictable outcome.
5.  **See the Results:** When a horse crosses the finish line, the winner is announced. Player balances are updated based on the results.
6.  **Play Again:** Click the **"Play Again"** button to start a new round of betting and racing.

## 💻 Tech Stack

- **Frontend Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Browser's `requestAnimationFrame` API for a smooth and efficient race loop.
- **Fonts:** Google Fonts (`Bungee` for titles, `Roboto` for text).

## 📂 Project Structure

```
.
├── components/
│   ├── BettingChip.tsx   # UI component for selecting a horse to bet on.
│   ├── GameBoard.tsx     # The main race track component.
│   └── HorseIcon.tsx     # The horse emoji and jockey number icon.
├── App.tsx               # Main application component, handles game logic and state.
├── constants.ts          # Game configuration (e.g., track length, horses, payout).
├── types.ts              # TypeScript type definitions for game entities.
├── index.html            # The main HTML file.
├── index.tsx             # React application entry point.
└── metadata.json         # Application metadata.
```

## 📜 Attribution

This game is a modern tribute to the classic "Gee-Wiz" horse racing game by Wolverine Supply & Mfg. Co., which brought joy to many with its clever mechanical design.
