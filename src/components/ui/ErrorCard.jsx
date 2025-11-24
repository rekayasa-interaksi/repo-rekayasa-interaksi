import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const ErrorCard = ({ onRetry, message }) => {
  return (
    <div className="md:col-span-3 flex flex-col items-center justify-center bg-white rounded-2xl border shadow-sm p-8 h-[50vh] w-[90%] mx-auto my-4">
      <HiOutlineExclamationCircle className="h-16 w-16 text-red-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Failed to Load Data</h3>
      <p className="text-gray-500 text-center mb-6 max-w-xs">
        {message}. Please try again later.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-secondary text-white rounded-full font-semibold hover:bg-secondary/70 transition">
        Try Again
      </button>
    </div>
  );
};

export default ErrorCard;
