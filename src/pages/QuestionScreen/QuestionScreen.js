// src/pages/QuestionScreen.js
import React, { useState, useEffect } from 'react';
import './QuestionScreen.css';
import Header from '../../components/Header/Header';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';

const QuestionScreen = ({ question, currentQuestionIndex, totalQuestions, onAnswerSelection, imageUrl }) => {
  const [hoveredOption, setHoveredOption] = useState(null);
  const optionHoverColor = '#cfcf14';

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="question-screen-container">
      {isMobile ? (
        <ProgressIndicator
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      ) : (
        <Header />
      )}

      <div className="question-content-wrapper">
        <div className="card-yellow-bg"></div>
        <div className="question-screen-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
        <div className="card-dark-overlay"></div>

        {/* NEW CONTAINER FOR QUESTION AND OPTIONS: `question-and-options-container` */}
        <div className="question-and-options-container">
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
        </div> {/* End of `question-and-options-container` */}
      </div>
    </div>
  );
};

export default QuestionScreen;