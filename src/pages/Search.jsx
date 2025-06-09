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

  const filteredCards = query.trim()
    ? cards.filter(card =>
        card.name.toLowerCase().includes(query.toLowerCase())
      )
    : cards.slice(0, 18); // featured

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
