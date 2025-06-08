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
  showBuyLink,
  showSetAndRarity,
  setName,
  rarity,
  number,
  printedTotal,
  qty
}) {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <div
      className={
        `bg-[#242424] p-3 rounded-xl shadow-md text-white text-sm cursor-pointer ` +
        `${className}`
      }
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyPress={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(e);
      }}
    >
      {children ? (
        <>
          {children}
          {/* Optional inventory/shop UI here */}
        </>
      ) : (
        <>
          <img
            src={image}
            alt={name}
            className="rounded-md w-full aspect-[3/4] object-cover mb-2"
          />
          <div>
            <p className="font-semibold text-sm mb-1">{name}</p>

            {!showSetAndRarity && setName && (
              <p className="text-xs text-gray-400">{setName}</p>
            )}

            {!showSetAndRarity && rarity && (
              <p className="text-xs text-gray-400 mb-1">
                {number && printedTotal ? `${number}/${printedTotal} | ` : ""}
                {rarity}
              </p>
            )}

            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              ${price?.toFixed?.(2) || "0.00"}
            </p>

            {typeof qty !== 'undefined' && (
              <p className="text-xs text-gray-400">Qty: {qty}</p>
            )}

            {showSetAndRarity && setName && (
              <p className="text-xs text-gray-400 mt-1">{setName}</p>
            )}
            {showSetAndRarity && rarity && (
              <p className="text-xs text-gray-400 mt-1">Rarity: {rarity}</p>
            )}
            {showSetAndRarity && number && printedTotal && (
              <p className="text-xs text-gray-400 mt-1">No: {number} / {printedTotal}</p>
            )}

            {showBuyLink && tcgplayerUrl && (
              <a
                href={tcgplayerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 hover:underline"
              >
                🛒 Buy on TCGplayer
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
