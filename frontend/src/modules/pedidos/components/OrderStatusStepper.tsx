import React from 'react';

export const OrderStatusStepper: React.FC<{ status: string }> = ({ status }) => {
  const steps = ['pending', 'preparing', 'ready', 'delivered'];
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex justify-between items-center mb-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              index <= currentStep
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                index < currentStep ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
