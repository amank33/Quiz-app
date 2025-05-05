import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import convertToFaIcons from '../../../helper/convertToFaIcons';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function QuizCard({ singleQuiz }) {
  const { allQuizzes, setAllQuizzes,selectedQuizObject } =
          useGlobalContextProvider();
  const { setSelectedQuiz } = selectedQuizObject;
  console.log('Single Quiz:', singleQuiz);
  console.log('allQuizzes Quiz:', allQuizzes);
  const { title, quizTitle, quizQuestions, icon } = singleQuiz;
  const displayTitle = title || quizTitle;
  const totalQuestions = quizQuestions.length;
  const navigate = useNavigate();

  const handleModify = () => {
    console.log('Modify quiz:', displayTitle);
    setSelectedQuiz(singleQuiz);
    navigate('/quiz-build', { state: { quiz: singleQuiz } });
  };

  const handleDelete = async () => {
    const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
    const confirmDelete = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(`${baseUrl}/api/exam/deleteExam/${singleQuiz.id}`);
      console.log('Delete response:', response.data);
      if (!response.data.status) {
        toast.error('Failed to delete the quiz. Please try again.');
        return;
      }
      setAllQuizzes(allQuizzes.filter(quiz => quiz.id !== singleQuiz.id));
      toast.success('Quiz deleted successfully!');
      
      // Optionally, trigger a refresh or update the state to remove the deleted quiz from the UI
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete the quiz. Please try again.');
    }
  };

  return (
    <div className="rounded-lg flex flex-col justify-between gap-4 border border-gray-200 bg-gradient-to-r from-white to-gray-100 p-6 hover:shadow-lg transition-shadow relative w-64 h-64">
      {/* Icon Section */}
      <motion.div className="flex justify-center items-center bg-gradient-to-r from-green-500 to-green-700 rounded-md h-32 shadow-md"
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.8 }}
      variants={{
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0 },
      }}
      >
        <FontAwesomeIcon
          className="text-white text-5xl"
          icon={convertToFaIcons(icon)}
        />
      </motion.div>

      {/* /* Title and Questions */ }
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="text-xl font-bold text-gray-900 truncate">{displayTitle}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <p>{totalQuestions} question{totalQuestions !== 1 ? 's' : ''}</p>
            <p>Attempts: {singleQuiz.totalQuizAttemptsAllowed || 'N/A'}</p>
          </div>
        </div>

        {/* Created By Section */}
      <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
        {singleQuiz.createdBy.profile_img ? (
          <img
            src={singleQuiz.createdBy.profile_img}
            alt="Creator"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-600">N/A</span>
          </div>
        )}
        <div className="text-center">
          <p className="font-medium text-gray-800">{singleQuiz.createdBy.username || 'Unknown'}</p>
          <p className="text-xs text-gray-500">Creator</p>
        </div>
      </div>
      <div className="flex items-center justify-center text-sm text-gray-500">
        <FontAwesomeIcon icon={faStopwatch} className="mr-2 text-green-500" />
        <p>Duration: {singleQuiz.quizDuration || 'N/A'} mins</p>
      </div>

      {/* Action Buttons */}
      <motion.div className="flex justify-center gap-4 mt-4"
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 2 }}
      variants={{
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0 },
      }}
      >
        <button
          onClick={handleModify}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faPencilAlt} /> Modify
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </button>
      </motion.div>
    </div>
  );
}

export default QuizCard;
