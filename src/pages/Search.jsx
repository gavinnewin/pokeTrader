// src/pages/Search.jsx
import React, { useState, useEffect } from "react";
import Searchbar from "../components/Searchbar";
import Section from "../components/Section";
import axios from "axios";
import Modal from "../components/Modal";
import Card from "../components/Card";

const POKEMON_TCG_API_KEY = "21740860-d49b-4c68-93ac-242a8461ff98";
const POKEMON_TCG_API_URL = "https://api.pokemontcg.io/v2";

export default function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const searchCards = async () => {
      if (!query.trim()) {
        setCards([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${POKEMON_TCG_API_URL}/cards`, {
          headers: {
            'X-Api-Key': POKEMON_TCG_API_KEY
          },
          params: {
            q: `name:"${query}"`,
            select: 'id,name,images,cardmarket,prices'
          }
        });

        const formattedCards = response.data.data.map(card => ({
          id: card.id,
          name: card.name,
          image: card.images.large,
          price: card.cardmarket?.prices?.averageSellPrice 
            ? `$${card.cardmarket.prices.averageSellPrice.toFixed(2)}`
            : 'Price not available',
          setName: card.set?.name || 'Unknown Set',
          rarity: card.rarity || 'Unknown Rarity',
          number: card.number || '',
          printedTotal: card.set?.printedTotal || '',
        }));

        setCards(formattedCards);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
        setError("Failed to fetch cards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to prevent too many API calls
    const timeoutId = setTimeout(searchCards, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  // Inject onClick into each card
  const injectOnClick = (items) =>
    items.map((card) => ({ ...card, onClick: () => handleCardClick(card) }));

  return (
    <div className="search-page p-4 text-white">
      <div className="max-w-screen-xl mx-auto">
        <Searchbar
          value={query}
          onChange={setQuery}
          className="w-64 mb-6"
          placeholder="Search for Pokemon cards..."
        />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Section
            title={query ? `Results for "${query}"` : "Search for Pokemon cards"}
            items={injectOnClick(cards)}
            cardSize="w-40"
          />
        )}
        <Modal isOpen={modalOpen} onClose={handleClose}>
          {selectedCard && (
            <Card {...selectedCard} className="w-64 mx-auto" showSetAndRarity={true} />
          )}
        </Modal>
      </div>
    </div>
  );
}
