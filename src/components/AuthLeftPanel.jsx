import React from 'react';

const logo = "/pokeball.png";

export default function AuthLeftPanel() {
  return (
    <div className="login-left">
      <img src={logo} alt="logo" className="logo" />
      <div className="login-left-content">
        <h1>Poke<span style={{ color: 'white' }}>Trader</span></h1>
        <p>the most popular pokemon portfolio app</p>
        <button className="read-more-btn">Read More</button>
      </div>
    </div>
  );
}
