export default function Card({ image, name, price, subtitle }) {
  return (
    <div className="bg-[#0f172a] p-2 rounded-xl shadow-md text-white text-sm">
      <img 
        src={image} 
        alt={name} 
        className="rounded-md w-full h-40 object-cover mb-2" 
      />
      <div>
        <p className="font-semibold">{name}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        <p className="text-xs text-gray-400 mt-1">{price}</p>
      </div>
    </div>
  );
}
