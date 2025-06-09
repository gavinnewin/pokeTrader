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
        className="flex-1 bg-white dark:bg-[#242424] placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 rounded text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
      />

      {/* Filter Icon — its own "box" */}
      <button
        aria-label="Filter"
        className="p-2 rounded bg-white dark:bg-[#242424] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition border border-gray-200 dark:border-gray-700"
      >
        <Sliders
          size={20} 
          className="transform rotate-90 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500"
        />
      </button>
    </div>
  );
}
