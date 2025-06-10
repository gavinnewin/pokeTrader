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
const top3Cards = [...portfolioCards]
  .filter(card => card && typeof card.price === 'number')
  .sort((a, b) => b.price - a.price)
  .slice(0, 3);
  return (
    <div className="home">
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
        <h2 className="section-title">Top 3 Cards</h2>
        <div className="performers-list">
          {top3Cards.map(card => (
            <div key={card._id} className="performer-card">
              <img src={card.image} alt={card.name} />
              <div className="card-info">
                <p className="card-name">{card.name}</p>
                {card.subtitle && <p className="card-subtitle">{card.subtitle}</p>}
                <p className="card-price">${card.price.toFixed(2)}</p>
              </div>
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

    </div>
  );
}
