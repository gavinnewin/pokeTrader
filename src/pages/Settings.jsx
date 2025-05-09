import React from "react";
import "./Settings.css";

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="section">
          <h2>Configuration:</h2>
          <div className="setting-item">
            <img src="/icons/language.svg" alt="Language" />
            <span>Language: English</span>
          </div>
          <div className="setting-item">
            <img src="/icons/theme.svg" alt="Theme" />
            <span>Theme: Dark Mode</span>
          </div>
          <div className="setting-item">
            <img src="/icons/notification.svg" alt="Notifications" />
            <span>Notifications: Pop Up</span>
          </div>
        </div>

        <hr />

        <div className="section">
          <h2>Profile:</h2>
          <button className="settings-btn">Change Password</button>
          <button className="settings-btn">Change Username</button>
          <button className="settings-btn">Change Email</button>
        </div>
      </div>
    </div>
  );
}
