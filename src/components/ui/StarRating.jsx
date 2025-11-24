import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const StarRating = ({ value, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((starIndex) => {
        const isFilled = (hoverRating || value) >= starIndex;

        return (
          <button
            type="button"
            key={starIndex}
            className={`text-2xl cursor-pointer transition-colors ${
              isFilled ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => onChange(starIndex)}
            onMouseEnter={() => setHoverRating(starIndex)}
            onMouseLeave={() => setHoverRating(0)}>
            <FontAwesomeIcon icon={isFilled ? faStar : faStarRegular} />
          </button>
        );
      })}
    </div>
  );
};
