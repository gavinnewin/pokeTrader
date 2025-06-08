import React from 'react';

const logo = "/pokeball.png";

export default function AuthLeftPanel() {
  const handleReadMore = () => {
    window.open('/temp.txt', '_blank');
  };

  return (
    <div className="login-left">
      <img src={logo} alt="logo" className="logo" />
      <div className="login-left-content">
        <h1>Poke<span style={{ color: 'white' }}>Trader</span></h1>
        <p>the most popular pokemon portfolio app</p>
        <button className="read-more-btn" onClick={handleReadMore}>Read More</button>
      </div>
    </div>
  );
}
