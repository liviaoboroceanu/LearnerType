// src/pages/ResultScreen.js
import React from 'react';
import './ResultScreen.css';
import Header from '../../components/Header/Header'; // Import the new Header component

// Removed userId prop since Firebase is no longer used
const ResultScreen = ({ finalResult, styleDescription, onRetakeQuiz, resultImageUrl }) => {
  // Remaining inline styles for dynamic background image
  const imageStyles = {
    backgroundImage: `url(${resultImageUrl})`,
  };

  return (
    <div className="result-screen-container">
      <Header /> {/* Use the new Header component */}

      <div className="result-content-wrapper">
        <div className="result-screen-image" style={imageStyles}></div>

        <div className="result-card">
          <h2 className="result-title-text">Your Learning Style: {finalResult}</h2>
          <p className="description-text">{styleDescription}</p>
        </div>

        {/* Removed userId display */}

        <button className="retake-quiz-button" onClick={onRetakeQuiz}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;