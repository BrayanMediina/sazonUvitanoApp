import React from 'react';

export const ChatInput: React.FC = () => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
      />
      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
        📤
      </button>
    </div>
  );
};
