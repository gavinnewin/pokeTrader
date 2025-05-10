import React, { useState } from "react";
import "./Home.css";

import LineChart from "../components/LineChart";
import MiniSparkline from "../components/MiniSparkline";
import Card from "../components/Card";
import { trendingData, topPerformers, portfolioData } from "../data";

export default function Home() {
  const ranges = ["1D","3D","7D","30D","3M","6M","1Y","All"];
  const [selectedRange, setSelectedRange] = useState("7D");

  return (
    <div className="home">
      {/* Collection Value & Top 3 */}
      <div className="collection-top">
        <Card className="collection-card">
          <h2 className="section-title">Collection Value</h2>
          <LineChart data={trendingData[selectedRange]} />
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

        <Card className="performers-card">
          <h2 className="section-title">Top 3 Performers</h2>
          <div className="performers-list">
            {topPerformers.map(p => (
              <div key={p.id} className="performer-card">
                <img src={p.image} alt={p.name} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Portfolio Grid */}
      <div>
        <h2 className="section-title">Your Portfolio</h2>
        <div className="portfolio-grid">
          {portfolioData.map(item => (
            <Card key={item.id} className="portfolio-item">
              <img src={item.image} alt={item.name} />
              <div className="info">
                <p className="name">{item.name}</p>
                <p className={`pnl ${item.pnl >= 0 ? "pnl-positive" : "pnl-negative"}`}>
                  P&L: ${item.pnl.toFixed(2)}
                </p>
                <p className="equity">
                  Equity: ${item.equity.toFixed(2)}
                </p>
              </div>
              <div className="sparkline">
                <MiniSparkline data={item.sparkData} />
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
