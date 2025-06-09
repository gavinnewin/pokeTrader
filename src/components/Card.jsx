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
  qty = 1,
  noShadow = false,
  inSearch = false,
  transparent = false,
  noHover = false,
  onQtyChange
}) {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [localQty, setLocalQty] = useState(qty);

  const handleQtyChange = (newQty) => {
    if (newQty < 1) return;
    setLocalQty(newQty);
    if (onQtyChange) {
      onQtyChange(newQty);
    }
  };

  return (
    <div
      className={
        `p-8 rounded-xl text-sm relative min-h-[400px] ` +
        `${transparent || noShadow ? '' : 'shadow-md'} ` +
        `${transparent ? '' : 'bg-white dark:bg-[#242424] cursor-pointer'} ` +
        `text-gray-800 dark:text-white ` +
        `${transparent || noHover ? '' : 'transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]'} ` +
        `${className}`
      }
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyPress={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(e);
      }}
    >
      {!showBuyLink && inSearch && !transparent && (
        <button 
          className="absolute bottom-8 right-8 w-10 h-10 rounded-full border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-red-500 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(); // This opens the modal
        }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
            className="rounded-md w-full aspect-[3/4] object-cover mb-6 max-h-[280px] transition-transform duration-200"
          />
          <div className={`flex-grow ${transparent ? 'bg-white dark:bg-[#242424] rounded-lg p-4 shadow-sm mb-4 -mx-12' : ''}`}>
            <p className="font-semibold text-base mb-1 text-gray-800 dark:text-white">{name}</p>

            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}

            {showSetAndRarity && (
              <>
                {setName && (
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">{setName}</p>
                )}
                {rarity && (
                  <p className="text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">
                    {rarity} {number && `● ${number}`} {printedTotal && `/ ${printedTotal}`}
                  </p>
                )}
              </>
            )}
          </div>
          
          <div className={`mt-auto pt-8 ${transparent ? 'bg-white dark:bg-[#242424] rounded-lg p-4 shadow-sm -mx-12' : ''}`}>
            <div className="flex items-center justify-between">
              {transparent && !showBuyLink && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQtyChange(localQty - 1);
                    }}
                    className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {localQty}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQtyChange(localQty + 1);
                    }}
                    className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              )}
              <p className="text-base font-semibold text-gray-800 dark:text-white">
                ${price?.toFixed?.(2) || "0.00"}
              </p>
            </div>
            {showBuyLink && tcgplayerUrl && (
              <a
                href={tcgplayerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors duration-200 whitespace-nowrap"
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
