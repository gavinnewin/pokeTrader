import React, { useState, useEffect } from "react";
import Searchbar from "../components/Searchbar";
import Section from "../components/Section";
import Modal from "../components/Modal";
import Card from "../components/Card";
const API = import.meta.env.VITE_API_URL;

export default function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
    if (filters.sortBy === 'random') {
      filtered = shuffleArray(filtered);
    } else {
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
        />

        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <Card
              {...selectedCard}
              className="w-64 mx-auto"
              showSetAndRarity={true}
              showBuyLink={false}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
