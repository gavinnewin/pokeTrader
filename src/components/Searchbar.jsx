// src/components/SearchBar.jsx
import { Filter } from "lucide-react";

export default function Searchbar() {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search for products"
        className="flex-1 bg-gray-800 placeholder-gray-400 px-4 py-2 rounded"
      />
      <Filter size={20} className="cursor-pointer hover:text-gray-300" />
    </div>
  );
}
