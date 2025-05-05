import React, { useState, useEffect } from 'react';
import { faCode, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGlobalContextProvider from '../../../hooks/ContextApi';

function QuizStartHeader({ duration, isQuizEnded, resetTimer, onTimeEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const { quizToStartObject } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const { quizTitle, quizQuestions } = selectQuizToStart;

  // Reset timer when resetTimer flag changes
  useEffect(() => {
    if (resetTimer) {
      setTimeLeft(duration * 60);
    }
  }, [resetTimer, duration]);

  // Handle countdown
  useEffect(() => {
    let timerId;

    // Only start timer if quiz is not ended and we have time left
    if (!isQuizEnded && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            onTimeEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timeLeft, isQuizEnded, onTimeEnd]);

  // Function to calculate time taken
  const calculateTimeTaken = () => duration - Math.floor(timeLeft / 60);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
      <div className="flex gap-4 items-center">
        <div className="bg-[#00df9a] w-12 h-12 flex items-center justify-center rounded-md">
          <FontAwesomeIcon className="text-black" width={25} height={25} icon={faCode} />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold text-xl text-gray-900">{quizTitle}</h2>
          <span className="text-sm text-gray-600">{quizQuestions.length} Questions</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
        <FontAwesomeIcon
          className="text-[#00df9a]"
          width={20}
          height={20}
          icon={faStopwatch}
        />
        <span className={`font-medium ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-700'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}

export default QuizStartHeader;
