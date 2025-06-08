// src/components/Card.jsx
import { useState } from "react";

export default function Card({
  image,
  name,
  price,
  subtitle,
  children,
  className = "",
  onClick,
  showSetAndRarity,
  setName,
  rarity,
  number,
  printedTotal,
  qty
}) {
  // Add state for inventory popup
  const [inventoryOpen, setInventoryOpen] = useState(false);
  return (
    <div
      className={
        `bg-[#242424] p-4 rounded-lg shadow text-white text-xs cursor-pointer ` +
        `${className}`
      }
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyPress={e => { if (onClick && (onClick && (e.key === 'Enter' || e.key === ' '))) onClick(e); }}
    >
      {/**
        * If someone passed in children, render that.
        * Otherwise fall back to the original image/name/price card.
        */}
      {children ? (
        <>
          {children}
          <div className="mt-4">
            {/* Expandable Inventory Section */}
            <button
              className="flex items-center gap-2 text-base font-semibold text-white mb-2 focus:outline-none"
              onClick={e => { e.stopPropagation(); setInventoryOpen(v => !v); }}
              aria-expanded={inventoryOpen}
              aria-controls="inventory-section"
              type="button"
            >
              <span>Your Inventory</span>
              <span className={`transition-transform duration-200 ${inventoryOpen ? 'rotate-90' : ''}`}>▶</span>
            </button>
            {inventoryOpen && (
              <div
                id="inventory-section"
                className="bg-[#232323] rounded p-2 mb-4 text-gray-300 text-xs transition-all duration-200"
              >
                (Inventory details...)
              </div>
            )}
            <h3 className="text-base font-semibold text-white mb-2">Shop</h3>
            {/* Shop content goes here */}
            <div className="bg-[#232323] rounded p-2 text-gray-300 text-xs">(Shop details...)</div>
          </div>
        </>
      ) : (
        <>
          <img 
            src={image} 
            alt={name} 
            className="rounded-md w-full aspect-[3/4] object-contain mb-1" 
          />
          <div>
            <p className="font-semibold mb-1">{name}</p>
            {/* Show set name and rarity on the card before the modal */}
            {setName && !showSetAndRarity && (
              <p className="text-xs text-gray-400"> {setName}</p>
            )}
            {/* Show rarity and number/printedTotal together */}
            {rarity && !showSetAndRarity && (
              <p className="text-xs text-gray-400 mb-2">
                {number && printedTotal ? `${number}/${printedTotal} | ` : ''}{rarity}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{price}</p>
            {/* Add quantity under the price if present */}
            {typeof qty !== 'undefined' && (
              <p className="text-xs text-gray-400 mt-1">Qty: {qty}</p>
            )}
            {/* Show set, rarity, and number/printedTotal only in modal */}
            {showSetAndRarity && setName && (
              <p className="text-xs text-gray-400 mt-1">{setName}</p>
            )}
            {showSetAndRarity && rarity && (
              <p className="text-xs text-gray-400 mt-1">Rarity: {rarity}</p>
            )}
            {showSetAndRarity && number && printedTotal && (
              <p className="text-xs text-gray-400 mt-1">No: {number} / {printedTotal}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
