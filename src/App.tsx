import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import SingleCard from './components/SingleCart';

export interface CardImage {
  src: string;
  matched: boolean;
  id?: number;
}

interface GameState {
  cards: CardImage[];
  choices: CardImage[];
  score: number;
  timer: number;
  isRunning: boolean;
  matchedCounter: number;
}

const cardImages: CardImage[] = [
  { src: './1.png', matched: false },
  { src: './2.png', matched: false },
  { src: './3.png', matched: false },
  { src: './4.png', matched: false },
  { src: './5.png', matched: false },
  { src: './6.png', matched: false },
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    choices: [],
    score: 0,
    timer: 0,
    isRunning: false,
    matchedCounter: 0,
  });

  const timeRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (gameState.isRunning) {
      timeRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timer: prev.timer + 1,
        }));
      }, 1000);
    } else {
      clearInterval(timeRef.current);
    }

    return () => {
      clearInterval(timeRef.current);
    };
  }, [gameState.isRunning]);

  const shuffleCard = () => {
    setGameState(prev => ({
      ...prev,
      cards: [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({ ...card, id: index })),
      isRunning: false,
      choices: [],
      score: 0,
      timer: 0,
      matchedCounter: 0,
    }));
  };

  const showResult = () => {
    setGameState(prev => ({
      ...prev,
      isRunning: false,
    }));
    alert(`Score: ${gameState.score}\nTime: ${gameState.timer} seconds`);
  };

  const checkMatch = (choices: CardImage[]) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 1,
    }));

    const [firstChoices, secondChoices] = choices;
    if (firstChoices.src === secondChoices.src) {
      setGameState(prev => ({
        ...prev,
        cards: prev.cards.map(card =>
          card.src === firstChoices.src ? { ...card, matched: true } : card,
        ),
      }));
      setGameState(prev => ({
        ...prev,
        matchedCounter: prev.matchedCounter + 1,
      }));

      if (gameState.matchedCounter === 5) {
        showResult();
      }
    }
    setGameState(prev => ({
      ...prev,
      choices: [],
    }));
  };

  const handleChoice = useMemo(
    () => (card: CardImage) => {
      if (!gameState.isRunning) {
        setGameState(prev => ({
          ...prev,
          isRunning: true,
        }));
      }

      if (gameState.choices.length < 2 && !gameState.choices.includes(card)) {
        const newChoices = [...gameState.choices, card];
        setGameState(prev => ({
          ...prev,
          choices: newChoices,
        }));

        if (newChoices.length === 2) {
          setTimeout(() => {
            checkMatch(newChoices);
          }, 500);
        }
      }
    },
    [gameState.choices],
  );

  return (
    <div className="App">
      <header className="header">
        <h1>Memory Cards Game</h1>
        <button onClick={shuffleCard}> Get Cards</button>
        <p>{gameState.isRunning ? `Score: ${gameState.score}` : 'Score: 0'}</p>
        <p>
          {gameState.isRunning
            ? `Time: ${gameState.timer} seconds`
            : 'Time: 0 seconds'}
        </p>
      </header>
      <div className="container">
        {' '}
        {gameState.cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={gameState.choices.includes(card) || card.matched}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
