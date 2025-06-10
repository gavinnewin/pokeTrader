import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";

import LineChart from "../components/LineChart";
import MiniSparkline from "../components/MiniSparkline";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { topPerformers } from "../data";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const ranges = ["1D","3D","7D","30D","3M","6M","1Y","All"];
  const [selectedRange, setSelectedRange] = useState("7D");
  const [selectedPerformer, setSelectedPerformer] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [portfolioCards, setPortfolioCards] = useState([]);
  const email = localStorage.getItem('email') || 'noemail@example.com';

  useEffect(() => {
    const fetchPortfolioHistory = async () => {
      try {
        const res = await axios.get(`${API}/api/user/portfolio-history`, {
          params: { email, range: selectedRange }
        });
        setPortfolioHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch portfolio history:', err);
        setPortfolioHistory([]);
      }
    };

    fetchPortfolioHistory();
  }, [selectedRange, email]);

  useEffect(() => {
    const fetchPortfolioCards = async () => {
      try {
        const res = await axios.get(`${API}/api/user/owned-cards`, {
          params: { email }
        });
        setPortfolioCards(res.data);
      } catch (err) {
        console.error('Failed to fetch portfolio cards:', err);
      }
    };

    fetchPortfolioCards();
  }, [email]);

  // Update portfolio value periodically
  useEffect(() => {
    const updatePortfolioValue = async () => {
      try {
        await axios.post(`${API}/api/user/update-portfolio-value`, { email });
      } catch (err) {
        console.error('Failed to update portfolio value:', err);
      }
    };

    // Update every hour
    const interval = setInterval(updatePortfolioValue, 60 * 60 * 1000);
    updatePortfolioValue(); // Initial update

    return () => clearInterval(interval);
  }, [email]);

  const chartData = Array.isArray(portfolioHistory) ? portfolioHistory.map(entry => ({
    time: new Date(entry.timestamp).toLocaleDateString(),
    value: entry.value
  })) : [];

  return (
    <div className="home">
      {/* Profile Section */}
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
        <span className="stat-value">
          {portfolioCards.reduce((sum, card) => sum + (card.qty || 1), 0)}
        </span>            
        <span className="stat-label">Cards</span>
          </div>
          <div className="stat-item">
          <span className="stat-value">
            ${portfolioCards.reduce((sum, card) => sum + ((card.price || 0) * (card.qty || 1)), 0).toFixed(2)}
          </span>
            <span className="stat-label">Total Value</span>
          </div>
          <div className="stat-item">
          <span className="stat-value">
            {portfolioCards.filter(card => (card.price * (card.qty || 1)) > 100).length}
          </span>
            <span className="stat-label">Premium Cards</span>
          </div>
        </div>
      </div>

      {/* Collection Value & Top 3 */}
      <div className="collection-top">
        <Card className="collection-card" noHover={true}>
          <h2 className="section-title">Collection Value</h2>
          <LineChart data={chartData} />
          <div className="range-buttons">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`range-btn ${
                  selectedRange === r ? "range-btn--selected" : ""
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </Card>

        <Card className="performers-card" noHover={true}>
          <h2 className="section-title">Top 3 Performers</h2>
          <div className="performers-list">
            {topPerformers.map(p => (
              <div 
                key={p.id} 
                className="performer-card"
                onClick={() => setSelectedPerformer(p)}
                style={{ cursor: 'pointer' }}
              >
                <img src={p.image} alt={p.name} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Portfolio Grid */}
      <div>
        <h2 className="section-title mb-3">Your Portfolio</h2>
        <div className="portfolio-grid">
          {portfolioCards.map(card => (
            <Card key={card._id} className="portfolio-item">
              <img src={card.image} alt={card.name} />
              <div className="info">
                <p className="name">{card.name}</p>
               <p className="equity">Qty: {card.qty || 1}</p>
                 <p className="equity">
                  Value: ${(card.price * (card.qty || 1)).toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        ©2025 PokeTrader. All rights reserved.
      </footer>

      {/* Modal for Top Performer Details */}
      <Modal 
        isOpen={!!selectedPerformer} 
        onClose={() => setSelectedPerformer(null)}
      >
        {selectedPerformer && (
          <div className="performer-details">
            <img 
              src={selectedPerformer.image} 
              alt={selectedPerformer.name} 
              className="performer-image-large"
            />
            <h2>{selectedPerformer.name}</h2>
            <div className="performer-stats">
              <p>Current Value: $1,234.56</p>
              <p>24h Change: +5.67%</p>
              <p>7d Change: +12.34%</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
