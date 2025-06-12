// src/App.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import './styles/App.css';
import { quiz, styleDescriptions } from './data/quizData';
import StartScreen from './pages/StartScreen/StartScreen';
import QuestionScreen from './pages/QuestionScreen/QuestionScreen';
import EndScreen from './pages/EndScreen/EndScreen';
import ResultScreen from './pages/ResultScreen/ResultScreen';

function App() {
  const [quizStage, setQuizStage] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [learningStyleDescription, setLearningStyleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Add isMobile state

  // Effect to update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define the base URL for your Python backend API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const QUIZ_RESULTS_ENDPOINT = `${API_BASE_URL}/api/quiz-results`;

  const handleStartQuiz = () => {
    setQuizStage('question');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setFinalResult(null);
    setUserEmail('');
    setLearningStyleDescription('');
  };

  const handleAnswerSelection = (selectedOptionKey) => {
    const newAnswers = [...userAnswers, selectedOptionKey];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex === quiz.length - 1) {
      setQuizStage('emailCollection');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleShowResults = async (email) => {
    setUserEmail(email);
    setIsLoading(true);

    const quizDataToSend = {
      answers: userAnswers,
      email: email,
    };

    try {
      const response = await fetch(QUIZ_RESULTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizDataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResult = await response.json();

      setFinalResult(backendResult.learningStyle);
      setLearningStyleDescription(backendResult.description);

      setQuizStage('results');
    } catch (error) {
      console.error("Error processing quiz results with backend:", error);
      setFinalResult("Error");
      setLearningStyleDescription("We encountered an issue processing your results. Please try again later.");
      setQuizStage('results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStage('start');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setFinalResult(null);
    setUserEmail('');
    setLearningStyleDescription('');
  };

  const currentQuestion = quiz[currentQuestionIndex];

  // Function to get the correct image URL based on screen size
  const getQuestionImageUrl = (question) => {
    return isMobile ? question.mobileImageUrl : question.laptopImageUrl;
  };

  const getResultImageUrl = (result) => {
    if (Array.isArray(result) && result.length > 1) {
      return isMobile ? styleDescriptions.Mixed.mobileImageUrl : styleDescriptions.Mixed.laptopImageUrl;
    } else if (result && styleDescriptions[result]) {
      return isMobile ? styleDescriptions[result].mobileImageUrl : styleDescriptions[result].laptopImageUrl;
    }
    return '';
  };

  const currentResultImageUrl = getResultImageUrl(finalResult);
  const currentQuestionImageUrl = currentQuestion ? getQuestionImageUrl(currentQuestion) : ''; // Safely get image for current question

  return (
    <div className="App">
      <header className="App-header">
        {quizStage === 'start' && (
          <StartScreen onStartQuiz={handleStartQuiz} isMobile={isMobile} />
        )}

        {quizStage === 'question' && currentQuestion && (
          <QuestionScreen
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={quiz.length}
            onAnswerSelection={handleAnswerSelection}
            imageUrl={currentQuestionImageUrl} // Pass the chosen image URL
          />
        )}

        {quizStage === 'emailCollection' && (
          <EndScreen
            onShowResults={handleShowResults}
            isLoading={isLoading}
            isMobile={isMobile} // Pass isMobile
          />
        )}

        {quizStage === 'results' && finalResult && (
          <ResultScreen
            finalResult={finalResult}
            styleDescription={learningStyleDescription}
            onRetakeQuiz={handleRestartQuiz}
            resultImageUrl={currentResultImageUrl} // Pass the chosen image URL
          />
        )}
      </header>
    </div>
  );
}

export default App;