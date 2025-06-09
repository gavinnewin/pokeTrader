import React, { useState, useEffect } from "react";
import Searchbar from "../components/Searchbar";
import Section from "../components/Section";
import axios from "axios";

import Modal from "../components/Modal";
import Card from "../components/Card";
const API = import.meta.env.VITE_API_URL;

export default function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingCard, setAddingCard] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: {
      min: '',
      max: ''
    },
    rarity: [],
    sortBy: 'random'
  });

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/cards`);
        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error("Fetch failed", err);
        setError("Failed to load cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (cards) => {
    let filtered = [...cards];

    // Apply search query filter
    if (query.trim()) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(card => 
        card.price >= parseFloat(filters.priceRange.min)
      );
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(card => 
        card.price <= parseFloat(filters.priceRange.max)
      );
    }

    // Apply rarity filter
    if (filters.rarity.length > 0) {
      filtered = filtered.filter(card => 
        filters.rarity.includes(card.rarity)
      );
    }

    // Apply sorting
    if (filters.sortBy !== 'random') {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const filteredCards = applyFilters(cards);
  const displayCards = filteredCards.map(card => ({
    ...card,
    onClick: () => handleCardClick(card)
  }));

const handleAddToPortfolio = async (card) => {
  const quantity = card.qty || 1; // get the user-selected qty
  setAddingCard(card.id);
  const email = localStorage.getItem('email') || 'noemail@example.com';

  try {
    await axios.post(`${API}/api/user/add-to-collection`, {
    email,
    cardId: card._id,
    quantity
    });

    alert(`${card.name} (x${quantity}) added to your portfolio!`);
  } catch (err) {
    console.error("Failed to add card to portfolio:", err);
    alert("Failed to add card to portfolio. Please try again.");
  } finally {
    setAddingCard(null);
  }
};


  const renderCard = (card) => (
    <div className="relative group">
      <img 
        src={card.image} 
        alt={card.name} 
        className="w-full h-auto rounded-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-75 text-white rounded-b-lg">
        <p className="text-sm font-medium truncate">{card.name}</p>
        <p className="text-xs">{card.price}</p>
        {card.subtitle && <p className="text-xs text-gray-300">{card.subtitle}</p>}
      </div>
      <button
      onClick={(e) => {
        e.stopPropagation(); // <- stops the outer card click
        handleCardClick(card); // opens modal
      }}        
      disabled={addingCard === card.id}
        className="absolute top-2 right-2 p-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700 disabled:opacity-50"
      >
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );

  const hasActiveFilters = () => {
    return query.trim() || 
           filters.priceRange.min || 
           filters.priceRange.max || 
           filters.rarity.length > 0 || 
           filters.sortBy !== 'random';
  };

  return (
    <div className="search-page p-4 text-white">
      <div className="max-w-screen-xl mx-auto">
        <Searchbar
          value={query}
          onChange={setQuery}
          onFilterChange={handleFilterChange}
          className="w-64 mb-6"
          placeholder="Search Pokemon cards..."
        />
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        <Section
          title={query ? `Results for "${query}"` : "Featured"}
          items={displayCards}
          cardSize="w-52"
          showBuyLink={false}
          showSetAndRarity={true}
          renderCard={renderCard}
        />

        {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col items-center gap-4">
        <Card
          {...selectedCard}
          className="w-52 mx-auto"
          showSetAndRarity={true}
          showBuyLink={false}
          qty={selectedCard?.qty || 1}
          onQtyChange={(newQty) => {
            setSelectedCard(prev => ({
              ...prev,
              qty: newQty
            }));
          }}
          inSearch={true} // required to show plus/minus buttons
          transparent={true} // ✅ this unlocks the Qty UI
        />

            <button
              onClick={() => handleAddToPortfolio(selectedCard)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              Add to Portfolio
            </button>
          </div>
        </Modal>
        )}
      </div>
    </div>
  );
}
