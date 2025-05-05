import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Img } from 'react-image';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import {
  faCode,
  faEllipsis,
  faPlay,
  faQuestion,
  faStopwatch,
  faStop 
} from '@fortawesome/free-solid-svg-icons';
import useGlobalContextProvider from '../../../hooks/ContextApi';
// import { icon } from '@fortawesome/fontawesome-svg-core';
import convertToFaIcons from '../../../helper/convertToFaIcons';
import { motion } from "framer-motion";

function successRate(singleQuiz) {
  let correctQuestions = 0;
  let totalAttemptes = 0;
  let successRate = 0;

  singleQuiz.quizQuestions.forEach((question) => {
    totalAttemptes += question.statistics.totalAttempts;
    correctQuestions += question.statistics.correctAttempts;
  });

  successRate = Math.ceil((correctQuestions / totalAttemptes) * 100);
  return successRate;
}

function QuizCard({ singleQuiz }) {
  const {
    quizToStartObject,
  } = useGlobalContextProvider();
  
  const { setSelectQuizToStart } = quizToStartObject;
  console.log(singleQuiz, 'singleQuiz');
  const { title, quizTitle, quizQuestions, quizDescription, quizDuration, icon,quizAttemptsLeft } = singleQuiz;
  const displayTitle = title || quizTitle; // Use title if available, fall back to quizTitle

  const totalQuestions = quizQuestions.length;
  const globalSuccessRate = successRate(singleQuiz);

  return (
    <motion.div className="rounded-lg flex flex-col gap-6 border border-gray-300 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow relative"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
    transition={{ duration: 1.2 }}
    variants={{
      hidden: { opacity: 0, y: -100 },
      visible: { opacity: 1, y: 0 },
    }} 
    >
      {/* Questions count badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
          {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3 mt-6">
        <h3 className="text-2xl font-bold text-gray-800">{displayTitle}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{quizDescription}</p>
      </div>

      {/* Quiz Info */}
      <div className="flex items-center text-sm text-gray-500 gap-2">
        <FontAwesomeIcon icon={faStopwatch} className="text-green-500" />
        <span>Duration: {quizDuration} minutes</span>
      </div>

      {/* Footer Area */}
      <motion.div className="flex items-center mt-auto pt-4 border-t border-gray-200 justify-between"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.5 }}
      variants={{
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0 },
      }} 
      >
        {quizAttemptsLeft > 0 ? (
          <>
            <button
              onClick={() => {
                setSelectQuizToStart(singleQuiz);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              <FontAwesomeIcon
                className="text-white"
                width={15}
                height={15}
                icon={faPlay}
              />
              <Link to="/quizStart" className="text-white no-underline">
                Start Quiz
              </Link>
            </button>
            <span className="text-gray-700 text-sm font-medium ml-2">
              Attempts left: {quizAttemptsLeft}
            </span>
          </>
        ) : (
          <button
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-300 text-gray-600 font-medium rounded-md cursor-not-allowed"
          >
            <FontAwesomeIcon
              className="text-gray-600"
              width={15}
              height={15}
              icon={faStop}
            />
            <span className="text-gray-600">Quiz Ended</span>
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default QuizCard;
