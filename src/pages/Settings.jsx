import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";

const API = import.meta.env.VITE_API_URL;

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const email = localStorage.getItem('email');

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const handleUpdate = async () => {
    let endpoint = "";
    let payload = {};

    if (modalType === "name") {
      endpoint = "/api/user/update-name";
      payload = { email, newName: inputValue };
      localStorage.setItem("fullName", inputValue);
    } else if (modalType === "email") {
      endpoint = "/api/user/update-email";
      payload = { currentEmail: email, newEmail: inputValue };
      localStorage.setItem("email", inputValue);
    } else if (modalType === "password") {
      endpoint = "/api/user/update-password";
      payload = { email, newPassword: inputValue };
    }

    try {
      await axios.post(`${API}${endpoint}`, payload);
      alert(`${modalType} updated!`);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="section">
          <h2>Configuration:</h2>
          <div className="setting-item">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="1.5" className="setting-icon">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 
                  0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 
                  12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="1.5" className="setting-icon">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
            <span>Theme: {isDarkMode ? "Dark Mode" : "Light Mode"}</span>
          </div>
        </div>

        <hr />

        <div className="section">
          <h2>Profile:</h2>
          <button className="settings-btn" onClick={() => {
            setModalType("password");
            setShowModal(true);
            setInputValue("");
          }}>
            Change Password
          </button>
          <button className="settings-btn" onClick={() => {
            setModalType("name");
            setShowModal(true);
            setInputValue("");
          }}>
            Change Username
          </button>
          <button className="settings-btn" onClick={() => {
            setModalType("email");
            setShowModal(true);
            setInputValue("");
          }}>
            Change Email
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update {modalType}</h3>
            <input
              type={modalType === "password" ? "password" : "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter new ${modalType}`}
            />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleUpdate}>Submit</button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
