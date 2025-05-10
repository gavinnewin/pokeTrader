// src/components/Card.jsx
export default function Card({
  image,
  name,
  price,
  subtitle,
  children,
  className = ""
}) {
  return (
    <div
      className={
        `bg-[#242424] p-2 rounded-lg shadow text-white text-xs ` +
        `${className}`
      }
    >
      {/**
        * If someone passed in children, render that.
        * Otherwise fall back to the original image/name/price card.
        */}
      {children ? (
        children
      ) : (
        <>
          <img 
            src={image} 
            alt={name} 
            className="rounded-md w-full aspect-[3/4] object-contain mb-1" 
          />
          <div>
            <p className="font-semibold">{name}</p>
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{price}</p>
          </div>
        </>
      )}
    </div>
  );
}
