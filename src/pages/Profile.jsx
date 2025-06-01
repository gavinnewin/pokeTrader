  import React, { useState, useRef } from "react";
  import "./Profile.css";
  import axios from "axios";

  export default function Profile() {
    const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '/avatar.png');
    const fileInputRef = useRef();

    const fullName = localStorage.getItem('fullName') || 'Guest';
    const email = localStorage.getItem('email') || 'noemail@example.com';

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('email', localStorage.getItem('email')); // 🔁 replace with actual auth user ID

      try {
        const res = await axios.post('http://localhost:5000/api/user/upload-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const url = res.data.url;
        localStorage.setItem('profilePic', url);
        setProfilePic(url);
      } catch (err) {
        console.error('Upload failed', err);
      }
    };

    const triggerFileSelect = () => {
      fileInputRef.current.click();
    };

    return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-left">
            <img src={profilePic} alt="Profile" className="profile-pic-large" />

          <h2 className="profile-name">
            {fullName}
          </h2>


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
            <div className="card-activity">
              <img src="/pokeball.png" alt="card" />
              <div>
                <strong>Pikachu with Grey Felt Hat</strong>
                <p>Near Mint • Holofoil</p>
                <p className="price-up">+$20.25 (+5.25%)</p>
                <p>Qty: 1</p>
              </div>
            </div>
            <div className="card-activity">
              <img src="/pokeball.png" alt="card" />
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
            <img src="/Gallery.png" />
            <span>Collection Value: $7850.41</span>
          </div>
          <div className="stat">
            <img src="/PokeMMO.png" />
            <span>14 Pokemons Owned</span>
          </div>
          <div className="action">
            <img src="/Collection.png" />
            <span>Add to Collection</span>
          </div>
          <div className="action">
            <img src="/Delete.png" />
            <span>Delete from Collection</span>
          </div>
        </div>
      </div>
    );
  }
