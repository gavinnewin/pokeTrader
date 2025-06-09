import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import { DollarSign, PlusCircle, Trash2 } from "lucide-react";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [portfolioCards, setPortfolioCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionCount, setCollectionCount] = useState(0);
  const [collectionValue, setCollectionValue] = useState(0);
  const email = localStorage.getItem('email') || 'noemail@example.com';

  useEffect(() => {
    const fetchPortfolioCards = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/user/owned-cards`, {
          params: { email }
        });
        setPortfolioCards(res.data);
        setCollectionCount(res.data.length);
        setCollectionValue(res.data.reduce((sum, card) => sum + (card.price || 0), 0));
      } catch (err) {
        console.error('Failed to fetch portfolio cards:', err);
        setError("Failed to load portfolio cards");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioCards();
  }, [email]);

  const handleAddCard = () => {
    if (!selectedCard) return alert("Pick a card first");

    axios.post(`${API}/api/user/add-to-collection`, {
      email: email,
      cardId: selectedCard
    }).then(() => {
      alert("Card added!");
      setShowModal(false);
      // Refresh the portfolio cards
      fetchPortfolioCards();
    }).catch(err => {
      console.error('Add failed', err);
      alert("Failed to add card.");
    });
  };

  const handleRemoveCard = () => {
    if (!selectedCard) return alert("Pick a card first");

    axios.post(`${API}/api/user/remove-from-collection`, {
      email: email,
      cardId: selectedCard
    }).then(() => {
      alert("Card removed!");
      setShowDeleteModal(false);
      // Refresh the portfolio cards
      fetchPortfolioCards();
    }).catch(err => {
      console.error('Remove failed', err);
      alert("Failed to remove card.");
    });
  };

  const totalValue = portfolioCards.reduce((sum, card) => sum + (card.price || 0), 0);
  const premiumCards = portfolioCards.filter(card => card.price > 100).length;

  return (
    <div className="profile-page">
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {email.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{email.split('@')[0]}</h1>
            <p className="profile-email">{email}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{portfolioCards.length}</span>
            <span className="stat-label">Cards</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">${totalValue.toFixed(2)}</span>
            <span className="stat-label">Total Value</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{premiumCards}</span>
            <span className="stat-label">Premium Cards</span>
          </div>
        </div>
      </div>

      <div className="portfolio-section">
        <div className="collection-header">
          <h2 className="section-title">Your Collection</h2>
          <div className="collection-actions">
            
            <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={24} />
              Delete from Collection
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading your collection...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="portfolio-grid">
            {portfolioCards.map(card => (
              <Card key={card._id} className="portfolio-item">
                <img src={card.image} alt={card.name} />
                <div className="info">
                  <p className="name">{card.name}</p>
                  <p className="equity">
                    Value: ${card.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select a Card</h3>
            <select onChange={(e) => setSelectedCard(e.target.value)}>
              <option value="">Choose one</option>
              {portfolioCards.map(card => (
                <option key={card._id} value={card._id}>{card.name}</option>
              ))}
            </select>
            <button onClick={handleAddCard}>Add</button>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select a Card to Remove</h3>
            <select onChange={(e) => setSelectedCard(e.target.value)}>
              <option value="">Choose one</option>
              {portfolioCards.map(card => (
                <option key={card._id} value={card._id}>{card.name}</option>
              ))}
            </select>
            <button onClick={handleRemoveCard}>Delete</button>
            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
