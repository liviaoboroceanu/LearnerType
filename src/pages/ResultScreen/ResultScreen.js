// src/pages/ResultScreen.js
import React from 'react';
import './ResultScreen.css';
import Header from '../../components/Header/Header';

const simpsonsQuotes = [
  "D'oh!",
  "Mmm... donuts.",
  "Eat my shorts!",
  "Don't have a cow, man.",
  "Ay caramba!",
  "I'm Bart Simpson, who the hell are you?",
  "Everything’s coming up Milhouse!"
];

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * simpsonsQuotes.length);
  return simpsonsQuotes[randomIndex];
};

const ResultScreen = ({ finalResult, styleDescription, onRetakeQuiz, resultImageUrl }) => {
  const imageStyles = {
    backgroundImage: `url(https://upload.wikimedia.org/wikipedia/en/0/0d/Simpsons_FamilyPicture.png)`,
  };

  return (
    <div className="result-screen-container">
      <Header />

      <div className="result-content-wrapper">
        <div className="result-screen-image" style={imageStyles}></div>

        <div className="result-card simpsons-theme-card">
          <h2 className="result-title-text simpsons-font">{finalResult}</h2>
          <p className="description-text simpsons-font">{styleDescription}</p>
          <p className="simpsons-quote">"{getRandomQuote()}"</p>
        </div>

        <button className="retake-quiz-button simpsons-button" onClick={onRetakeQuiz}>
          🔁 Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
