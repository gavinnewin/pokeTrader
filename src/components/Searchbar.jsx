import { Filter } from "lucide-react";

export default function Searchbar({ value, onChange }) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for products"
        className="flex-1 bg-gray-800 placeholder-gray-400 px-4 py-2 rounded text-white"
      />
      <Filter size={20} className="cursor-pointer hover:text-gray-300" />
    </div>
  );
}
