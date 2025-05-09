import React from "react";
import "./Profile.css"; // you'll create this

export default function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-left">
          <img src="/avatar.png" alt="Profile" className="profile-pic-large" />
          <h2>
            Bessie Cooper <span className="verified-badge">✔</span>
          </h2>
          <p className="subtitle">Software Engineer</p>

          <a href="#" className="change-pic">change profile picture</a>

          <div className="contact-info">
            <div>
              <img src="/public/mail.png" alt="email" />
              BessieC@gmail.com
            </div>
            <div>
              <img src="/public/phone.png" alt="phone" />
              648-991-2764
            </div>
          </div>
        </div>

        <div className="profile-right">
          <h2>Activity</h2>
          <div className="card-activity">
            <img src="/public/pokeball.png" alt="card" />
            <div>
              <strong>Pikachu with Grey Felt Hat</strong>
              <p>Near Mint • Holofoil</p>
              <p className="price-up">+$20.25 (+5.25%)</p>
              <p>Qty: 1</p>
            </div>
          </div>

          <div className="card-activity">
            <img src="/public/pokeball.png" alt="card" />
            <div>
              <strong>Pikachu with Grey Felt Hat</strong>
              <p>Near Mint • Holofoil</p>
              <p className="price-down">- $10.25 (-2.25%)</p>
              <p>Qty: 1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <div className="stat">
          <img src="/icons/wallet.svg" />
          <span>Collection Value: $7850.41</span>
        </div>
        <div className="stat">
          <img src="/icons/ball.svg" />
          <span>14 Pokemons Owned</span>
        </div>
        <div className="action">
          <img src="/icons/add.svg" />
          <span>Add to Collection</span>
        </div>
        <div className="action">
          <img src="/icons/delete.svg" />
          <span>Delete from Collection</span>
        </div>
      </div>
    </div>
  );
}
