// src/components/Searchbar.jsx
import { Sliders } from "lucide-react";

export default function Searchbar({ value, onChange, placeholder = "Search for products" }) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-[#242424] placeholder-gray-400 px-4 py-2 rounded text-white"
      />

      {/* Filter Icon — its own "box" */}
      <button
        aria-label="Filter"
        className="p-2 rounded bg-[#242424] hover:bg-[#1f1f1f] transition"
      >
        <Sliders
          size={20} 
          className="transform rotate-90 text-gray-300 hover:text-white"
        />
      </button>
    </div>
  );
}
