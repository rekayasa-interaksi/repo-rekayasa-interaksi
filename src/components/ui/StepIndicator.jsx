import React from 'react';

const TITLES = ['Account Details', 'Personal Details', 'Academic & Community', 'Social Media'];
const TOTAL_STEPS = 4;

export const StepIndicator = ({ currentStep }) => {
  const currentTitle = TITLES[currentStep - 1];
  const progressPercent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{currentTitle}</h3>
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-orange-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}></div>
      </div>
    </div>
  );
};
