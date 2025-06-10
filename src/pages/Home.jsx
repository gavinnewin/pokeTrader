import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";
import axios from "axios";

import LineChart from "../components/LineChart";
import Card from "../components/Card";
import Modal from "../components/Modal";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const ranges = ["1D","3D","7D","30D","3M","6M","1Y","All"];
  const [selectedRange, setSelectedRange] = useState("7D");
  const [selectedPerformer, setSelectedPerformer] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [portfolioCards, setPortfolioCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const email = localStorage.getItem('email') || 'noemail@example.com';

  const fetchPortfolioHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/user/portfolio-history`, {
        params: { email, range: selectedRange }
      });
      setPortfolioHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch portfolio history:', err);
      setPortfolioHistory([]);
    }
  }, [email, selectedRange]);

  const fetchPortfolioCards = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/user/owned-cards`, {
        params: { email }
      });
      setPortfolioCards(res.data);
    } catch (err) {
      console.error('Failed to fetch portfolio cards:', err);
    }
  }, [email]);

  const updatePortfolioValue = useCallback(async () => {
    try {
      await axios.post(`${API}/api/user/update-portfolio-value`, { email });
      await fetchPortfolioHistory();
    } catch (err) {
      console.error('Failed to update portfolio value:', err);
    }
  }, [email, fetchPortfolioHistory]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPortfolioHistory(), fetchPortfolioCards()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchPortfolioHistory, fetchPortfolioCards]);

  useEffect(() => {
    fetchPortfolioHistory();
  }, [selectedRange, fetchPortfolioHistory]);

  useEffect(() => {
    const interval = setInterval(updatePortfolioValue, 60 * 60 * 1000);
    updatePortfolioValue();
    return () => clearInterval(interval);
  }, [updatePortfolioValue]);

  useEffect(() => {
    const handleCardChange = async () => {
      await Promise.all([
        fetchPortfolioCards(),
        updatePortfolioValue()
      ]);
    };

    window.addEventListener('cardCollectionChanged', handleCardChange);
    return () => {
      window.removeEventListener('cardCollectionChanged', handleCardChange);
    };
  }, [fetchPortfolioCards, updatePortfolioValue]);

  const chartData = portfolioHistory.map(entry => ({
    time: entry.timestamp,
    value: parseFloat(entry.value)
  }));

  const totalValue = portfolioCards.reduce((sum, card) => sum + ((card.price || 0) * (card.qty || 1)), 0);
  const totalCards = portfolioCards.reduce((sum, card) => sum + (card.qty || 1), 0);
  const premiumCards = portfolioCards.filter(card => card.price > 100).length;

  const top3Cards = [...portfolioCards]
    .filter(card => card && typeof card.price === 'number')
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  return (
    <div className="home">
      

      <div className="collection-top">
        <Card className="collection-card" noHover={true}>
          <div className="collection-header">
            <h2 className="section-title">Collection Value</h2>
            <div className="current-value">
              ${totalValue.toFixed(2)}
            </div>
          </div>
          {isLoading ? (
            <div className="loading">Loading chart data...</div>
          ) : (
            <>
              <LineChart data={chartData} />
              <div className="range-buttons">
                {ranges.map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`range-btn ${selectedRange === range ? "range-btn--selected" : ""}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="performers-card" noHover={true}>
          <h2 className="section-title">Top 3 Cards</h2>
          <div className="performers-list">
            {top3Cards.map(card => (
              <div 
                key={card._id} 
                className="performer-card"
                onClick={() => setSelectedPerformer(card)}
                style={{ cursor: 'pointer' }}
              >
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

      <div>
        <h2 className="section-title mb-3">Your Portfolio</h2>
        <div className="portfolio-grid">
          {portfolioCards.map(card => (
            <Card key={card._id} className="portfolio-item">
              <img src={card.image} alt={card.name} />
              <div className="info">
                <p className="name">{card.name}</p>
                <p className="equity">Qty: {card.qty || 1}</p>
                <p className="equity">Value: ${(card.price * (card.qty || 1)).toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <footer className="footer">
        ©2025 PokeTrader. All rights reserved.
      </footer>

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
              <p>Current Value: ${selectedPerformer.price?.toFixed(2)}</p>
              <p>Qty: {selectedPerformer.qty || 1}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}