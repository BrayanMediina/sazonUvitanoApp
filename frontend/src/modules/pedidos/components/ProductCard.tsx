import React from 'react';

export const ProductCard: React.FC<{
  id: string;
  name: string;
  price: number;
  image?: string;
  onClick?: () => void;
}> = ({ id, name, price, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-3 cursor-pointer hover:shadow-lg transition-shadow"
    >
      {image && (
        <img src={image} alt={name} className="w-full h-24 object-cover rounded mb-2" />
      )}
      <h3 className="font-semibold text-sm">{name}</h3>
      <p className="text-orange-600 font-bold">${price}</p>
    </div>
  );
};
