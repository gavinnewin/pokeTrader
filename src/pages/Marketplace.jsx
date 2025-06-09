// src/pages/Marketplace.jsx
import { useState, useEffect } from "react";
import Section from "../components/Section";
import Searchbar from "../components/Searchbar";

const API = import.meta.env.VITE_API_URL;

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: {
      min: '',
      max: ''
    },
    rarity: [],
    sortBy: 'random'
  });

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/api/cards`);
        const allCards = await res.json();
        const filtered = allCards.filter(card => card.tcgplayerUrl);
        setCards(filtered);

        if (email) {
          const watchRes = await fetch(`${API}/api/user/watchlist?email=${email}`);
          const userWatchlist = await watchRes.json();
          setWatchlist(userWatchlist.filter(card => card.tcgplayerUrl));
        }
      } catch (err) {
        console.error("Error fetching cards", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  const filteredWatchlist = applyFilters(watchlist);

  const hasActiveFilters = () => {
    return query.trim() || 
           filters.priceRange.min || 
           filters.priceRange.max || 
           filters.rarity.length > 0 || 
           filters.sortBy !== 'random';
  };

  return (
    <div className="marketplace p-4 text-white">
      <div className="max-w-screen-xl mx-auto">
        <Searchbar 
          value={query} 
          onChange={setQuery} 
          onFilterChange={handleFilterChange}
          className="w-64 mb-6" 
        />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : hasActiveFilters() ? (
          <Section
            title={query ? `Results for "${query}"` : "Filtered Results"}
            items={filteredCards}
            cardSize="w-52"
            showSetAndRarity={true}
          />
        ) : (
          <>
            <Section
              title="Featured"
              items={cards.slice(0, 5)}
              cardSize="w-52"
              showSetAndRarity={false}
            />
            {watchlist.length > 0 ? (
              <Section
                title="From Your Watchlist"
                items={watchlist}
                cardSize="w-52"
                showSetAndRarity={false}
              />
            ) : (
              <>
                <Section
                  title="Most Expensive Cards"
                  items={[...cards].sort((a, b) => b.price - a.price).slice(0, 5)}
                  cardSize="w-52"
                  showSetAndRarity={false}
                />
                <Section
                  title="Least Expensive Cards"
                  items={[...cards].sort((a, b) => a.price - b.price).slice(0, 5)}
                  cardSize="w-52"
                  showSetAndRarity={false}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
