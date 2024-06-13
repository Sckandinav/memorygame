import React, { memo } from 'react';
import { CardImage } from '../App';
import './SingleCard.css';

const SingleCart = memo(function SingleCard({
  card,
  handleChoice,
  flipped,
}: {
  card: CardImage;
  handleChoice(card: CardImage): void;
  flipped: boolean;
}) {
  return (
    <div className="card">
      <img
        className={flipped ? 'card__img flipped' : 'card__img'}
        src={card.src}
        alt="card"
        // onClick={() => handleChoice(card)}
      />
      <img
        className={flipped ? 'card__question flipped' : 'card__question '}
        src="./question.png"
        alt="question card"
        onClick={() => handleChoice(card)}
      />
    </div>
  );
});

export default SingleCart;
