// src/pages/EndScreen.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import './EndScreen.css';
import Header from '../../components/Header/Header';

const EndScreen = ({ onShowResults, isLoading, isMobile }) => { // Accept isMobile prop
  const [email, setEmail] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);

  // Determine the correct image path based on isMobile prop
  const endScreenImagePath = isMobile
    ? '/images/mobile/mobile-end-screen.png'
    : '/images/laptop/laptop-end-screen.png';

  const handleSubmit = () => {
    if (email) {
      setShowEmailError(false);
      onShowResults(email);
    } else {
      setShowEmailError(true);
    }
  };

  return (
    <div className="end-screen-container">
      <Header />

      <div className="end-content-wrapper">
        <div
          className="end-screen-image"
          style={{ backgroundImage: `url(${endScreenImagePath})` }} // Use dynamic path
        ></div>

        <button onClick={handleSubmit} className="show-results-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'SHOW Results'}
        </button>

        <input
          type="email"
          placeholder="What's your email address?"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setShowEmailError(false);
          }}
          className={`email-input ${showEmailError ? 'input-error' : ''}`}
          disabled={isLoading}
        />

        {showEmailError && (
          <p className="email-error-message">Please enter your email address to see your results.</p>
        )}

        <p className="instruction-text">Enter your email to uncover your results!</p>
      </div>
    </div>
  );
};

export default EndScreen;