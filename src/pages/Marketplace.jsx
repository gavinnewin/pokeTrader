import { useState, useEffect } from "react";
import Section from "../components/Section";
import Searchbar from "../components/Searchbar";

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${API}/api/cards`);
        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error("Failed to fetch cards", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filtered = cards
  .filter(card => card?.name?.toLowerCase().includes(query.toLowerCase()))
  .filter(card => card?.name && card?.image && card?.price)

  return (
    <div className="marketplace p-4 text-white">
      <div className="max-w-screen-xl mx-auto">
        <Searchbar
          value={query}
          onChange={setQuery}
          className="w-64 mb-6"
        />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : query ? (
          <Section
            title={`Results for "${query}"`}
            items={filtered.slice(0, 6)}
            cardSize="w-40"
          />
        ) : (
          <>
            <Section title="Featured" items={cards.slice(0, 6)} cardSize="w-40" />
            <Section title="From Your Watchlist" items={cards.slice(6)} cardSize="w-40" />
          </>
        )}
      </div>
    </div>
  );
}
