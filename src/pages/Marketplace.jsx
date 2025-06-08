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

  const filtered = cards.filter(card =>
    card?.name?.toLowerCase().includes(query.toLowerCase())
  );

  const expensive = [...cards].sort((a, b) => b.price - a.price).slice(0, 6);
  const cheap = [...cards].sort((a, b) => a.price - b.price).slice(0, 6);

  return (
    <div className="marketplace p-4 text-white">
      <div className="max-w-screen-xl mx-auto">
        <Searchbar value={query} onChange={setQuery} className="w-64 mb-6" />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : query ? (
          <Section
            title={`Results for "${query}"`}
            items={filtered.slice(0, 6)}
            cardSize="w-40"
            showSetAndRarity={false}
          />
        ) : (
          <>
            <Section
              title="Featured"
              items={cards.slice(0, 6)}
              cardSize="w-40"
              showSetAndRarity={false}
            />
            {watchlist.length > 0 ? (
              <Section
                title="From Your Watchlist"
                items={watchlist}
                cardSize="w-40"
                showSetAndRarity={false}
              />
            ) : (
              <>
                <Section
                  title="Most Expensive Cards"
                  items={expensive}
                  cardSize="w-40"
                  showSetAndRarity={false}
                />
                <Section
                  title="Budget Picks"
                  items={cheap}
                  cardSize="w-40"
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
