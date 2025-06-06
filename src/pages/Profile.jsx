import React, { useState, useRef, useEffect } from "react";
import "./Profile.css";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '/avatar.png');
  const fileInputRef = useRef();

  const fullName = localStorage.getItem('fullName') || 'Guest';
  const email = localStorage.getItem('email') || 'noemail@example.com';

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [collectionCount, setCollectionCount] = useState(0);
  const [collectionValue, setCollectionValue] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ownedCards, setOwnedCards] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/user/activity?email=${email}`)
      .then(res => setActivityLog(res.data))
      .catch(err => console.error('Activity fetch failed', err));
  }, []);

  useEffect(() => {
    axios.get(`${API}/api/user/owned-cards?email=${email}`)
      .then(res => setOwnedCards(res.data))
      .catch(err => console.error('Owned cards fetch failed', err));
  }, []);

  useEffect(() => {
    axios.get(`${API}/api/user/collection-count?email=${email}`)
      .then(res => setCollectionCount(res.data.count))
      .catch(err => console.error('Count fetch failed', err));
  }, []);

  useEffect(() => {
    axios.get(`${API}/api/cards`)
      .then(res => setCards(res.data))
      .catch(err => console.error('Card fetch failed', err));
  }, []);

  useEffect(() => {
    axios.get(`${API}/api/user/collection-value?email=${email}`)
      .then(res => setCollectionValue(res.data.total))
      .catch(err => console.error('Value fetch failed', err));
  }, []);

  const handleAddCard = () => {
    if (!selectedCard) return alert("Pick a card first");

    axios.post(`${API}/api/user/add-to-collection`, {
      email,
      cardId: selectedCard
    }).then(() => {
      alert("Card added!");
    }).catch(err => {
      console.error('Add failed', err);
      alert("Failed to add card.");
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('email', email);

    try {
      const res = await axios.post(`${API}/api/user/upload-profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const url = res.data.url;
      localStorage.setItem('profilePic', url);
      setProfilePic(url);
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleRemoveCard = () => {
    if (!selectedCard) return alert("Pick a card to remove");

    axios.post(`${API}/api/user/remove-from-collection`, {
      email,
      cardId: selectedCard
    }).then(() => {
      alert("Card removed!");
    }).catch(err => {
      console.error('Remove failed', err);
      alert("Failed to remove card.");
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-left">
          <img src={profilePic} alt="Profile" className="profile-pic-large" />
          <h2 className="profile-name">{fullName}</h2>
          <a href="#" className="change-pic" onClick={triggerFileSelect}>change profile picture</a>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div className="contact-info">
            <div>
              <img src="/mail.png" alt="email" />
              {email}
            </div>
          </div>
        </div>

        <div className="profile-right">
          <h2>Activity</h2>
          {activityLog.map((entry, index) => (
            <div className="card-activity" key={index}>
              <img src="/pokeball.png" alt="card" />
              <div>
                <strong>{entry.message}</strong>
                <p>{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-footer">
        <div className="stat">
          <img src="/Gallery.png" />
          <span>Collection Value: ${collectionValue.toFixed(2)}</span>
        </div>
        <div className="stat">
          <img src="/PokeMMO.png" />
          <span>{collectionCount} Pokemons Owned</span>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          <img src="/Collection.png" />
          Add to Collection
        </button>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Select a Card</h3>
              <select onChange={(e) => setSelectedCard(e.target.value)}>
                <option value="">Choose one</option>
                {cards.map(card => (
                  <option key={card._id} value={card._id}>{card.name}</option>
                ))}
              </select>
              <button onClick={handleAddCard}>Add</button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
          <img src="/Delete.png" />
          Delete from Collection
        </button>

        {showDeleteModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Select a Card to Remove</h3>
              <select onChange={(e) => setSelectedCard(e.target.value)}>
                <option value="">Choose one</option>
                {ownedCards.map(card => (
                  <option key={card._id} value={card._id}>{card.name}</option>
                ))}
              </select>
              <button onClick={() => {
                handleRemoveCard();
                setShowDeleteModal(false);
              }}>Delete</button>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
