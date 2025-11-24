import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const HelpButton = () => {
  return (
    <button
      onClick={() => window.location.href = '/help'}
      className="fixed bottom-8 right-8 rounded-full shadow-lg transition-all duration-300 z-50"
      aria-label="Help and Support"
    >
      <FontAwesomeIcon icon={faQuestionCircle} className="text-4xl text-secondary bg-white rounded-full" />
    </button>
  );
};

export default HelpButton;
