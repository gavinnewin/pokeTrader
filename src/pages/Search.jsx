import React, { useState, useEffect } from "react";
import Searchbar from "../components/Searchbar";
import Section from "../components/Section";

import Modal from "../components/Modal";
import Card from "../components/Card";

export default function Search() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingCard, setAddingCard] = useState(null);

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

  const handleAddToPortfolio = async (card) => {
    setAddingCard(card.id);
    const email = localStorage.getItem('email') || 'noemail@example.com';
    
    try {
      await axios.post('/api/user/add-card', {
        email,
        card: {
          id: card.id,
          name: card.name,
          image: card.image,
          price: card.marketPrice,
          quantity: 1
        }
      });
      
      // Show success message or update UI
      alert(`${card.name} added to your portfolio!`);
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
        onClick={() => handleAddToPortfolio(card)}
        disabled={addingCard === card.id}
        className="absolute top-2 right-2 p-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700 disabled:opacity-50"
      >
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );

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
