import { useState } from "react";

export default function Card({
  image,
  name,
  price,
  subtitle,
  tcgplayerUrl,
  children,
  className = "",
  onClick,
  showBuyLink = true,
  showSetAndRarity,
  setName,
  rarity,
  number,
  printedTotal,
  qty,
  noShadow = false,
  inSearch = false
}) {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <div
      className={
        `p-3 rounded-xl text-sm cursor-pointer relative ` +
        `${noShadow ? '' : 'shadow-md'} ` +
        `bg-white dark:bg-[#242424] text-gray-800 dark:text-white ` +
        `${className}`
      }
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyPress={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(e);
      }}
    >
      {!showBuyLink && inSearch && (
        <button 
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-red-500 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            // Add your click handler here
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {children ? (
        <>
          {children}
          {/* Optional inventory/shop UI here */}
        </>
      ) : (
        <div className="flex flex-col h-full">
          <img
            src={image}
            alt={name}
            className="rounded-md w-full aspect-[3/4] object-cover mb-2"
          />
          <div className="flex-grow">
            <p className="font-semibold text-sm mb-1 text-gray-800 dark:text-white">{name}</p>

            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}

            {showSetAndRarity && (
              <>
                {setName && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{setName}</p>
                )}
                {rarity && number && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {rarity} ● {number} {printedTotal && `/ ${printedTotal}`}
                  </p>
                )}
              </>
            )}
          </div>
          
          <div className="mt-auto pt-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              ${price?.toFixed?.(2) || "0.00"}
            </p>
            {showBuyLink && tcgplayerUrl && (
              <a
                href={tcgplayerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-blue-600 dark:text-blue-400 hover:underline text-xs"
              >
                🛒 Buy on TCGplayer
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
