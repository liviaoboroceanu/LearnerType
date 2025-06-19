// src/components/ProgressIndicator.js
import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ currentQuestionIndex, totalQuestions }) => {
  return (
    <div className="progress-indicator-container">
      {Array.from({ length: totalQuestions }).map((_, idx) => (
        <div
          key={idx}
          className={`progress-card ${idx === currentQuestionIndex ? 'active' : ''}`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressIndicator;