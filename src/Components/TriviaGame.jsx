import React, { useState, useEffect } from "react";

function TriviaGame() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState("");
  const [totalQuestionsServed, setTotalQuestionsServed] = useState(0); // Track total questions served
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      await fetchQuestion();
    };
  
    fetchData();
  

  }, [currentIndex]);
  

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1");
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const questionData = data.results[0];
          setQuestion(questionData.question);
          setOptions(
            [
              ...questionData.incorrect_answers,
              questionData.correct_answer,
            ].sort(() => Math.random() - 0.5)
          );
          setCorrectAnswer(questionData.correct_answer);
          setTotalQuestionsServed(totalQuestionsServed + 1);
        } else {
          throw new Error("No questions found");
        }
      } else if (response.status === 429) {
        console.error("Rate limit exceeded. Please wait and try again.");
      } else {
        throw new Error("Failed to fetch question");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === correctAnswer) {
      setAnswerResult("Correct!");
      setTotalCorrect(totalCorrect + 1);
    } else {
      setAnswerResult("Incorrect!");
      setTotalIncorrect(totalIncorrect + 1);
    }
  };


  const reload = ()=>{
    setCurrentIndex(0);
    setTotalCorrect(0);
    setTotalIncorrect(0);
    setTotalQuestionsServed(0);
  }
  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setSelectedOption("");
    setAnswerResult("");
  };

  if (currentIndex === 10) {
    return (
        <div className="main-outer-container">
      <div className="main-inner-container">
        <h2>Results</h2>
        {/* <p>Total Questions Served: {totalQuestionsServed}</p> */}
        <p>Total Correct Questions: {totalCorrect}</p>
        <p>Total Incorrect Questions: {totalIncorrect}</p>
        <div  className="main-button-container">
            <button onClick={reload}>Restart</button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="main-outer-container">
      <div className="main-inner-container">
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            <h2 className="main-heading">Question {currentIndex + 1}</h2>
            <p>{question}</p>
            <ul>
              {options.map((option, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)}
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            <div className="main-button-container">
              <button onClick={handleSubmit}>Submit</button>
            </div>
            <p className={answerResult === "Correct!" ? "correct" : "incorrect"}>
              {answerResult}
            </p>
            {answerResult && <p>Correct Answer: {correctAnswer}</p>}
            <div className="main-button-container">
              {answerResult && <button onClick={handleNextQuestion}>Next</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TriviaGame;
