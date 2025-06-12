// src/pages/QuestionScreen.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import './QuestionScreen.css';
import Header from '../../components/Header/Header';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';

const QuestionScreen = ({ question, currentQuestionIndex, totalQuestions, onAnswerSelection, imageUrl }) => {
  const [hoveredOption, setHoveredOption] = useState(null);
  const optionHoverColor = '#cfcf14';

  // State to track if the screen is mobile size (<= 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div className="question-screen-container">
      {isMobile ? (
        // On mobile, show only the Progress Indicator
        <ProgressIndicator
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      ) : (
        // On laptop, show the normal Header
        <Header /> 
      )}

      <div className="question-content-wrapper">
        <div className="card-yellow-bg"></div>
        <div className="question-screen-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
        <div className="card-dark-overlay"></div>

        <h2 className="question-text">
          Question {currentQuestionIndex + 1} of {totalQuestions}: {question.question}
        </h2>

        {Object.keys(question.options).map((optionKey) => (
          <button
            key={optionKey}
            className={`option-button option-${optionKey}`}
            onMouseEnter={() => setHoveredOption(optionKey)}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => onAnswerSelection(optionKey)}
            style={{
                backgroundColor: hoveredOption === optionKey ? optionHoverColor : '#ffffff',
            }}
          >
            {optionKey}. {question.options[optionKey].text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionScreen;