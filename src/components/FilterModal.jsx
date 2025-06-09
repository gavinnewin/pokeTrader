import React, { useState } from 'react';
import Modal from './Modal';

export default function FilterModal({ isOpen, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    priceRange: {
      min: '',
      max: ''
    },
    rarity: [],
    sortBy: 'random'
  });

  const rarityOptions = [
    'Common',
    'Uncommon',
    'Rare',
    'Rare Holo',
    'Rare Ultra',
    'Rare Secret'
  ];

  const handleRarityChange = (rarity) => {
    setFilters(prev => ({
      ...prev,
      rarity: prev.rarity.includes(rarity)
        ? prev.rarity.filter(r => r !== rarity)
        : [...prev.rarity, rarity]
    }));
  };

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: {
        min: '',
        max: ''
      },
      rarity: [],
      sortBy: 'random'
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Filter Cards</h2>
        
        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price Range</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min Price</label>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#242424] text-gray-800 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Max Price</label>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#242424] text-gray-800 dark:text-white"
                placeholder="1000.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Rarity */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rarity</h3>
          <div className="grid grid-cols-2 gap-2">
            {rarityOptions.map((rarity) => (
              <label
                key={rarity}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.rarity.includes(rarity)}
                  onChange={() => handleRarityChange(rarity)}
                  className="rounded text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{rarity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#242424] text-gray-800 dark:text-white"
          >
            <option value="random">Random</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
} 