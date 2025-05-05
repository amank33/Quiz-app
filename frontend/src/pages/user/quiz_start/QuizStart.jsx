import React, { useEffect, useState } from 'react';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import QuizStartHeader from './QuizStartHeader';
import QuizStartQuestions from './QuizStartQuestions';
import { useNavigate } from 'react-router-dom';
import { Img } from 'react-image';
import { motion } from "framer-motion";

function QuizStart() {
  const { quizToStartObject } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  console.log(selectQuizToStart, 'selectQuizToStart');
  const [quizState, setQuizState] = useState({
    isEnded: false,
    shouldResetTimer: false,
    score: 0
  });
  const [quizAttemptsLeft, setQuizAttemptsLeft] = useState();
  
  const navigate = useNavigate();

  useEffect(() => {
    if(selectQuizToStart?.quizAttemptsLeft)
    setQuizAttemptsLeft(selectQuizToStart?.quizAttemptsLeft); 

    if (!selectQuizToStart) {
      navigate('/TakeQuiz');
    }
  }, [selectQuizToStart, navigate]);

  const handleQuizStateChange = (changes) => {
    setQuizState(prev => {
      const newState = { ...prev, ...changes };
      
      // If shouldResetTimer is being set to true, ensure we handle the reset
      if (changes.shouldResetTimer) {
        setTimeout(() => {
          setQuizState(current => ({ ...current, shouldResetTimer: false }));
        }, 500); // Increased delay to ensure timer resets properly
      }
      
      // If isEnded is being set to false, this is a quiz restart
      if (changes.isEnded === false && prev.isEnded === true) {
        return {
          isEnded: false,
          shouldResetTimer: true,
          score: 0
        };
      }
      
      return newState;
    });
  };

  if (!selectQuizToStart) {
    return (
      <div className="h-svh flex flex-col gap-2 items-center justify-center">
        <Img src="/errorIcon.png" alt="" width={180} height={180} />
        <h2 className="text-xl font-bold">Please select a quiz first...</h2>
        <span className="font-light">You will be redirected to the home page</span>
      </div>
    );
  }

  return (
    <motion.div className="relative poppins flex flex-col px-24 mt-[35px]"
    initial='hidden'
          animate="visible"
    transition={{ duration: 1 }}
    viewport={{ once: true, amount: 0.6 }}
    variants={{
      hidden: { opacity: 0, y: -90 },
      visible: { opacity: 1, y: 0 },
    }} >
      <QuizStartHeader 
        duration={selectQuizToStart.quizDuration} 
        isQuizEnded={quizState.isEnded} 
        resetTimer={quizState.shouldResetTimer}
        onTimeEnd={() => handleQuizStateChange({ isEnded: true })}
      />
      <div className="mt-10 flex items-center justify-center">
        <QuizStartQuestions 
          onQuizStateChange={handleQuizStateChange}
          quizState={quizState}
          quizAttemptsLeft={quizAttemptsLeft}
          setQuizAttemptsLeft={setQuizAttemptsLeft}

        />
      </div>
    </motion.div>
  );
}

export default QuizStart;
