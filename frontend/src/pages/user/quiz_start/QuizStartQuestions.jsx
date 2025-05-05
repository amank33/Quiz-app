import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import { Img } from 'react-image';
import axios from 'axios';
import { motion } from 'framer-motion';

function QuizStartQuestions({ quizState, onQuizStateChange,quizAttemptsLeft, setQuizAttemptsLeft }) {
  const { quizToStartObject, allQuizzes, setAllQuizzes } = useGlobalContextProvider();
  const { selectQuizToStart, setSelectQuizToStart } = quizToStartObject;
  const { quizQuestions } = selectQuizToStart;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [quizIndex, setQuizIndex] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(new Date());
  const [quizEndTime, setquizEndTime] = useState(new Date());
  const isFirstRender = useRef(true);
  console.log(quizAttemptsLeft,'quizAttemptsLeft');
  // const [tryAgainCount, setTryAgainCount] = useState(()=>{
  //   const user = JSON.parse(sessionStorage.getItem('user'))?.user;
  //   const enrolledExams = user?.enrolledExams || [];
    
  //   let filteredObj=enrolledExams.find((quiz) => quiz.examId === selectQuizToStart.id);
  //   return filteredObj?.quizAttemptsLeft||0; 
  // });
  

  const navigate = useNavigate();
  console.log(quizState, 'quizState');
  useEffect(() => {
    const index = allQuizzes.findIndex(quiz => quiz.id === selectQuizToStart.id);
    setQuizIndex(index);
  }, [allQuizzes, selectQuizToStart.id]);

  useEffect(() => {
    setQuizStartTime(new Date()); // Initialize quiz start time when component mounts
  }, []);

  useEffect(() => {
    if(quizState.isEnded){
    handleQuizEnd();}

  }, [quizState.isEnded]);

  // useEffect(() => {
  
  //   const user = JSON.parse(sessionStorage.getItem('user'))?.user;
  //   const enrolledExams = user?.enrolledExams || [];
  //   debugger;
  
  //   // const filteredQuizzes = allQuizzes.filter((quiz) =>
  //   //   enrolledExams.some((enrolledQuiz) => enrolledQuiz.examId === quiz.id)
  //   // );
  //   let filteredObj=enrolledExams.find((quiz) => quiz.examId === selectQuizToStart.id);
  //   setTryAgainCount(filteredObj?.quizAttemptsLeft||1);  
  
  //   }, []);

  //   useEffect(() => {
  //     if (quizAttemptsLeft != null && quizAttemptsLeft != 'undefined') {
  //   const userObj = JSON.parse(sessionStorage.getItem('user'))
  //   const user = userObj?.user;
  //   const enrolledExams = user?.enrolledExams || [];
  //   let filteredObj=enrolledExams.find((quiz) => quiz.examId === selectQuizToStart.id);
  //   if(filteredObj){
  //     filteredObj.quizAttemptsLeft=quizAttemptsLeft;
  //     filteredObj.totalAttempts=filteredObj.totalAttempts+1;
  //     filteredObj.score=filteredObj.score+quizState.score;
  //   }
  //   const enrolledExamsUpdated = enrolledExams.map((quiz) => {
  //     if (quiz.examId === selectQuizToStart.id) {
  //       return filteredObj;
  //     }
  //     return quiz;
  //   });

  //   let userUpdated={...userObj};
  //   userUpdated.user.enrolledExams=enrolledExamsUpdated;
    
  //   debugger;
  //   sessionStorage.setItem('user', JSON.stringify(userUpdated));
  // }

  //   }, [quizAttemptsLeft]);
  
  // Centralize quizAttemptsLeft state management in QuizStartQuestions
  useEffect(() => {
    if (quizAttemptsLeft !== null && quizAttemptsLeft !== undefined) {
      const userObj = JSON.parse(sessionStorage.getItem('user'));
      const user = userObj?.user;
      const enrolledExams = user?.enrolledExams || [];
      const filteredObj = enrolledExams.find((quiz) => quiz.examId === selectQuizToStart.id);
  
      if (filteredObj) {
        filteredObj.quizAttemptsLeft = quizAttemptsLeft;
        filteredObj.totalAttempts = (filteredObj.totalAttempts || 0) + 1;
        filteredObj.score = (filteredObj.score || 0) + quizState.score;
      }
  
      const enrolledExamsUpdated = enrolledExams.map((quiz) => {
        if (quiz.examId === selectQuizToStart.id) {
          return filteredObj;
        }
        return quiz;
      });
  
      const userUpdated = { ...userObj, user: { ...user, enrolledExams: enrolledExamsUpdated } };
      sessionStorage.setItem('user', JSON.stringify(userUpdated));
    }
  }, [quizAttemptsLeft]);

  const updateQuizStatistics = (isCorrect) => {
    const updatedQuizzes = [...allQuizzes];
    const currentQuestion = updatedQuizzes[quizIndex].quizQuestions[currentQuestionIndex];
    
    currentQuestion.statistics.totalAttempts += 1;
    if (isCorrect) {
      currentQuestion.statistics.correctAttempts += 1;
      onQuizStateChange({ score: quizState.score + 1 });
    } else {
      currentQuestion.statistics.incorrectAttempts += 1;
    }
    
    setAllQuizzes(updatedQuizzes);
  };

  const handleChoiceSelection = (choiceIndex) => {
    setSelectedChoice(choiceIndex);
    const currentAllQuizzes = [...allQuizzes];
    currentAllQuizzes[quizIndex].quizQuestions[currentQuestionIndex].answeredResult = choiceIndex;
    setAllQuizzes(currentAllQuizzes);
  };

  const handleSubmitAnswer = () => {
    if (selectedChoice === null) {
      toast.error('Please select an answer');
      return;
    }

    const currentQuestion = allQuizzes[quizIndex].quizQuestions[currentQuestionIndex];
    const isCorrect = selectedChoice === currentQuestion.correctAnswer;
    updateQuizStatistics(isCorrect);

    

    if (!isCorrect) {
      toast.error('Incorrect Answer!');
      if (currentQuestionIndex === quizQuestions.length - 1) {
       // handleQuizEnd();
       setquizEndTime(new Date());
       onQuizStateChange({ isEnded: true });
       
       
      } else {
        setTimeout(() => moveToNextQuestion(), 1200);
      }
      return;
    }

    toast.success('Awesome!');
    
    if (currentQuestionIndex === quizQuestions.length - 1) {
      //handleQuizEnd();
      setquizEndTime(new Date());
      onQuizStateChange({ isEnded: true });
      
      //handleQuizEnd();
      return;
    }

    setTimeout(() => moveToNextQuestion(), 1200);
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedChoice(null);
  };

  const resetQuiz = () => {
    // First reset local component state
    setCurrentQuestionIndex(0);
    setSelectedChoice(null);
    isFirstRender.current = true;
    
    // Reset the quiz answers in global context
    const updatedQuizzes = [...allQuizzes];
    if (quizIndex !== null) {
      // Reset all question answers and statistics
      updatedQuizzes[quizIndex].quizAttemptsLeft=quizAttemptsLeft;
      updatedQuizzes[quizIndex].quizQuestions.forEach(question => {
        question.answeredResult = -1;
        question.statistics = {
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
        };
      });
      setAllQuizzes(updatedQuizzes);
    }
    
    // Update parent component state
    onQuizStateChange({
      isEnded: false,
      shouldResetTimer: true,
      score: 0
    });

    // Force a re-render by updating the selected quiz
    setSelectQuizToStart(prev => ({...prev, quizAttemptsLeft: quizAttemptsLeft}));
    setQuizStartTime(new Date());
  };

  const submitQuizResults = async (quizData) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseUrl}/api/exam/submitQuiz`, quizData);
      toast.success('Quiz results submitted successfully!');
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      toast.error('Failed to submit quiz results. Please try again.');
    }
  };

  const handleQuizEnd = async () => {
    debugger;
    const user = JSON.parse(sessionStorage.getItem('user'))?.user;
    const quizData = {
      studentId: user._id, // Assuming studentId is available in selectQuizToStart
      examId: selectQuizToStart.id,
      answers: quizQuestions.map((q) => ({
        questionId: q.id, // Include questionId
        answer: q.correctAnswer, // Selected option index
        answeredResult: q.answeredResult //=== q.correctAnswer ? 1 : 0 // Determine correctness
      })),
      score: quizState.score,
      totalCorrect: quizState.score,
      totalIncorrect: quizQuestions.length - quizState.score,
      timeTaken: calculateTimeTaken("min"), // Use the calculateTimeTaken function from QuizStartHeader
      timeTakenSeconds: calculateTimeTaken("sec"), // Time in milliseconds
    };

//    await submit//Quizlts(//quta);
await submitQuizResults(quizData);
//onQuizStateChange({ isEnded: true });
  };

  const calculateTimeTaken = (time) => {
    debugger;
    const totalDurationInMinutes = selectQuizToStart.quizDuration; // Assuming duration is in minutes
    const elapsedTimeInMilliseconds = quizEndTime - quizStartTime;
    const elapsedTimeInMinutes = Math.floor(elapsedTimeInMilliseconds / 60000);
    const elapsedTimeInSeconds = Math.floor((elapsedTimeInMilliseconds % 60000) / 1000);
    const totalSecondsElapsed = Math.floor(elapsedTimeInMilliseconds / 1000); // Total seconds elapsed
    const remainingTimeInMinutes = totalDurationInMinutes - elapsedTimeInMinutes;
    const remainingTimeInSeconds = 60 - elapsedTimeInSeconds;

if(time==="sec"){
  return totalSecondsElapsed;
}else{
    return `${elapsedTimeInMinutes}:${elapsedTimeInSeconds < 10 ? '0' : ''}${elapsedTimeInSeconds}`;
}//return elapsedTimeInMinutes;
  };

  if (quizState.isEnded) {
    //handleQuizEnd();
    
   

    return (
      <ScoreComponent
        score={quizState.score}
        totalQuestions={quizQuestions.length}
        quizAttemptsLeft={quizAttemptsLeft}
        setQuizAttemptsLeft={setQuizAttemptsLeft}
        onTryAgain={resetQuiz}
        selectQuizToStart={selectQuizToStart}
        isFirstRender={isFirstRender}
      />
    );
  }

  return (
    <motion.div className="w-full max-w-3xl bg-white rounded-lg shadow-sm p-6"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
    transition={{ duration: 1 }}
    variants={{
      hidden: { opacity: 0, y: -90 },
      visible: { opacity: 1, y: 0 },
    }}
    >
      <Toaster
        toastOptions={{
          duration: 1500,
          style: { padding: '12px' },
        }}
      />
      
      {/* Question Display */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#00df9a] flex justify-center items-center rounded-md w-12 h-12 text-black font-medium">
          {currentQuestionIndex + 1}
        </div>
        <p className="text-lg text-gray-800">{quizQuestions[currentQuestionIndex].mainQuestion}</p>
      </div>

      {/* Answer Choices */}
      <div className="space-y-3">
        {quizQuestions[currentQuestionIndex].choices.map((choice, index) => (
          <div
            key={index}
            onClick={() => handleChoiceSelection(index)}
            className={`p-4 border rounded-lg cursor-pointer transition-all
              ${selectedChoice === index 
                ? 'border-[#00df9a] bg-[#00df9a] text-black' 
                : 'border-gray-200 hover:border-[#00df9a] hover:bg-[#00df9a]/5'
              }`}
          >
            {choice}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to end this quiz? Your progress will be lost.')) {
              //navigate('/TakeQuiz');
              window.location.href = '/TakeQuiz';
            }
          }}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          End Quiz
        </button>

        <button
          onClick={handleSubmitAnswer}
          className="px-6 py-2 bg-[#00df9a] text-black font-medium rounded-md hover:bg-[#00bf82] transition-colors"
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
}

function ScoreComponent({ score, totalQuestions, quizAttemptsLeft, setQuizAttemptsLeft, onTryAgain, selectQuizToStart, isFirstRender }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setQuizAttemptsLeft((prev) => {
        let updateLeft = prev - 1;

        // Update session storage
        const userObj = JSON.parse(sessionStorage.getItem('user'));
        const user = userObj?.user;
        const enrolledExams = user?.enrolledExams || [];
        let filteredObj = enrolledExams.find((quiz) => quiz.examId === selectQuizToStart.id);
        if (filteredObj) {
          filteredObj.quizAttemptsLeft = updateLeft;
          filteredObj.totalAttempts = filteredObj.totalAttempts + 1;
          filteredObj.score = filteredObj.score + score;
        }
        const enrolledExamsUpdated = enrolledExams.map((quiz) => {
          if (quiz.examId === selectQuizToStart.id) {
            return filteredObj;
          }
          return quiz;
        });

        let userUpdated = { ...userObj };
        userUpdated.user.enrolledExams = enrolledExamsUpdated;

        sessionStorage.setItem('user', JSON.stringify(userUpdated));

        return updateLeft;
      });
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const emojiIconScore = () => {
    const result = (score / totalQuestions) * 100;
    if (result < 25) return 'confused-emoji.png';
    if (result === 50) return 'happy-emoji.png';
    return 'very-happy-emoji.png';
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial="hidden"
      animate="visible"
      // whileInView="visible"
       viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1 }}
      variants={{
        hidden: { opacity: 0, y: -90 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="bg-black/50 absolute inset-0" />
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl p-8">
        <div className="flex flex-col items-center gap-6">
          <Img src={`/${emojiIconScore()}`} alt="Score Emoji" className="w-20 h-20" />

          <div className="text-center">
            <h2 className="font-bold text-2xl text-gray-800 mb-4">Your Score</h2>
            <div className="text-5xl font-extrabold text-[#00df9a]">
              {score}/{totalQuestions}
            </div>
          </div>

          {quizAttemptsLeft > 0 && (
            <div className="text-center">
              <button
                onClick={onTryAgain}
                className="px-6 py-3 bg-[#00df9a] text-black font-semibold rounded-lg hover:bg-[#00bf82] transition-all shadow-md"
              >
                Try Again
              </button>
              <p className="mt-2 text-gray-600 text-sm">
                You have <span className="font-medium">{quizAttemptsLeft}</span> attempts left
              </p>
            </div>
          )}

          {/* <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"></div>
                <Img src="/correct-answer.png" alt="Correct" className="w-6 h-6" />
                <span className="text-gray-700 font-medium">Correct Answers:</span>
              </div>
              <span className="text-gray-800 font-bold">{score}</span>
            </div> */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Img src="/correct-answer.png" alt="Correct" className="w-6 h-6" />
                <span className="text-gray-700 font-medium">Correct Answers:</span>
              </div>
              <span className="text-gray-800 font-bold">{score}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Img src="/incorrect-answer.png" alt="Incorrect" className="w-6 h-6" />
                <span className="text-gray-700 font-medium">Incorrect Answers:</span>
              </div>
              <span className="text-gray-800 font-bold">{totalQuestions - score}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => window.location.href = '/TakeQuiz'}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
            >
              Home
            </button>
            <button
              onClick={() => window.location.href = '/TakeQuiz'}
              className="px-4 py-2 text-sm font-medium text-[#00df9a] border border-[#00df9a] rounded-lg hover:bg-[#00df9a]/10 transition-all"
            >
              Select Another Quiz
            </button>
          </div>
        </div>
      
    </motion.div>
  );
}

export default QuizStartQuestions;
