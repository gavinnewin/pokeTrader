import React from 'react';

export default function Card({ image, name, price }) {
  return (
    <div className="bg-gray-800 rounded overflow-hidden">
      <img src={image} alt={name} className="w-full h-32 object-cover"/>
      <div className="p-2">
        <p className="text-sm">{name}</p>
        <p className="mt-1 text-xs text-gray-400">{price}</p>
      </div>
    </div>
  );
}
