import React, { useState } from "react";
import confetti from 'canvas-confetti';
import styles from "./Quiz.module.css";

const Quiz = ({ questions }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [showResults, setShowResults] = useState(
    Array(questions.length).fill(false)
  );
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (questionIndex, selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleSubmit = (questionIndex) => {
    const newShowResults = [...showResults];
    newShowResults[questionIndex] = true;
    setShowResults(newShowResults);

    const correctChoice = questions[questionIndex].choices.find(choice => choice.is_correct);
    if (answers[questionIndex] === correctChoice.choice_text) {
      setScore(score + 1);
    }

    if (questionIndex === questions.length - 1) {
      setQuizCompleted(true);
      if (score === questions.length - 1) {
        var defaults = {
          spread: 360,
          ticks: 50,
          gravity: 0,
          decay: 0.94,
          startVelocity: 30,
          colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
        };
        
        function shoot() {
          confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
          });
        
          confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
          });
        }
        
        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
      }
    }
  };

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill(""));
    setShowResults(Array(questions.length).fill(false));
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className={styles.quizContainer}>
      {questions.map((question, index) => (
        <div
          key={index}
          className={`${styles.question} ${
            index > 0 && !showResults[index - 1] ? styles.disabled : ""
          }`}
        >
          <h3>Question {index + 1}</h3>
          <p>{question.question_text}</p>
          <div className={styles.options}>
            {question.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex} className={styles.option}>
                <input
                  type="radio"
                  value={choice.choice_text}
                  checked={answers[index] === choice.choice_text}
                  onChange={() => handleAnswer(index, choice.choice_text)}
                  disabled={showResults[index]}
                />
                {choice.choice_text}
                {showResults[index] && answers[index] === choice.choice_text && !choice.is_correct && (
                  <span className={styles.incorrect}>✗</span>
                )}
                {showResults[index] && choice.is_correct && (
                  <span className={styles.correct}>✓</span>
                )}
              </label>
            ))}
          </div>
          {!showResults[index] ? (
            <button
              onClick={() => handleSubmit(index)}
              disabled={
                !answers[index] || (index > 0 && !showResults[index - 1])
              }
              className={styles.button}
            >
              Submit
            </button>
          ) : (
            <div
              className={`alert ${
                answers[index] === question.choices.find(c => c.is_correct).choice_text
                  ? "alert--success"
                  : "alert--danger"
              }`}
            >
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      ))}
      {quizCompleted && (
        <div className={styles.results}>
          <h2>Quiz Completed!</h2>
          <p>
            Your final score: {score} out of {questions.length}
          </p>
          {score === questions.length && (
            <p className={styles.perfect}>Perfect score! Well done!</p>
          )}
          <button onClick={resetQuiz} className={styles.button}>
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
