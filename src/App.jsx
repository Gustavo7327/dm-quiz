import React, { useState, useEffect } from 'react';
import './App.css';
import questionsData from './data/questions.json';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function QuestionCard({ questionData, questionIndex, onAnswer, answered, allAnswered }) {
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    setShuffledOptions(shuffleArray(questionData.options));
  }, [questionData]);

  return (
    <div className="question-card">
      <h2 className="question-text">
        {questionIndex + 1}. {questionData.question}
      </h2>
      <div className="options-container">
        {shuffledOptions.map((option, i) => {
          const isSelected = answered[questionIndex] !== undefined;
          const isCorrectAnswer = option === questionData.answer;
          const isChosen = option === answered[questionIndex];

          let buttonClass = 'option-button';
          if (isSelected && allAnswered) {
            if (isCorrectAnswer) {
              buttonClass = 'correct';
            } else if (isChosen) {
              buttonClass = 'incorrect';
            } else {
              buttonClass = 'not-chosen';
            }
          }

          return (
            <label key={i} className={buttonClass}>
              <input
                type="radio"
                name={`question-${questionIndex}`}
                value={option}
                checked={isChosen}
                disabled={allAnswered}
                onChange={() => onAnswer(questionIndex, option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function DartQuizApp() {
  const [answered, setAnswered] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  

  const handleAnswer = (index, selectedOption) => {
    setAnswered((prev) => ({ ...prev, [index]: selectedOption }));
  };

  const handleSubmit = () => {
    setShowAnswers(true);
  };

  const handleRestart = () => {
    setAnswered({});
    setShowAnswers(false);
    setRestartKey((prev) => prev + 1);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  };

  const allAnswered = Object.keys(answered).length === questionsData.length;

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz sobre Dart e Android</h1>
      {questionsData.map((q, idx) => (
        <QuestionCard
          key={`${restartKey}-${idx}`}
          questionData={q}
          questionIndex={idx}
          onAnswer={handleAnswer}
          answered={answered}
          allAnswered={showAnswers}
        />
      ))}
      {!showAnswers && allAnswered && (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>
            Enviar respostas
          </button>
        </div>
      )}
      {showAnswers && (
        <div className="restart-container">
          <button className="restart-button" onClick={handleRestart}>
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  );
}
