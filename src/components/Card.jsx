export default function Card({ image, name, price, subtitle }) {
  return (
    <div className="bg-[#0f172a] p-2 rounded-lg shadow text-white text-xs w-[160px]">
      <img 
        src={image} 
        alt={name} 
        className="rounded-md w-full aspect-[3/4] object-contain mb-1" 
      />
      <div>
        <p className="font-semibold">{name}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        <p className="text-xs text-gray-400 mt-1">{price}</p>
      </div>
    </div>
  );
}
