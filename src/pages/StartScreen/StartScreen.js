// src/pages/StartScreen.js
import React, { useState, useEffect } from 'react';
import './StartScreen.css';
import Header from '../../components/Header/Header';

const StartScreen = ({ onStartQuiz, isMobile }) => {
  const startScreenImagePath = isMobile
    ? '/images/mobile/mobile-start-screen.png'
    : '/images/laptop/laptop-start-screen.png';

  const imageStyles = {
    backgroundImage: `url(${startScreenImagePath})`,
  };

  const buttonStyles = {
    backgroundColor: '#cfcf14',
    color: '#000000',
  };

  return (
    <div className="start-screen-container">
      <Header />

      <div className="start-screen-content">
        <div className="image-button-group"> {/* Add this new div */}
          <div style={imageStyles} className="start-screen-image"></div>
          <button style={buttonStyles} onClick={onStartQuiz} className="start-screen-button">
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;