import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, max = 5 }) => {
  return (
    <div className="star-rating">
      {[...Array(max)].map((_, index) => (
        index < rating
          ? <FaStar key={index} className="star filled" />
          : <FaRegStar key={index} className="star empty" />
      ))}
    </div>
  );
};

export default StarRating;
