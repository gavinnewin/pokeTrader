// src/pages/Search.jsx
import React, { useState, useEffect } from "react";
import Searchbar from "../components/Searchbar";
import Section from "../components/Section";

export default function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cards");
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

  const filtered = cards.filter(item =>
    item?.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page p-4 text-white">
      <div className="max-w-screen-xl mx-auto">
        <Searchbar
          value={query}
          onChange={setQuery}
          className="w-64 mb-6"
        />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Section
            title={query ? `Results for "${query}"` : "Featured"}
            items={filtered.slice(0, 6)}
            cardSize="w-40"
          />
        )}
      </div>
    </div>
  );
}
