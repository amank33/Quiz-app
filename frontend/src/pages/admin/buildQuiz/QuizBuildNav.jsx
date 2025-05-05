'use client';
import React, { useEffect, useState } from 'react';
import { Img } from 'react-image';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import { v4 as uuidv4 } from 'uuid';
import { faCode } from '@fortawesome/free-solid-svg-icons';

import toast, { Toaster } from 'react-hot-toast';
import convertFromFaToText from '../../../helper/convertToFaIcons';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {motion} from 'framer-motion';


function QuizBuildNav({ quizHeader,quizQuestions,newQuiz, setNewQuiz }) {
  let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
      const { userAuth,allQuizzes, setAllQuizzes, selectedQuizObject } =
        useGlobalContextProvider();
        const { selectedQuiz, setSelectedQuiz }=selectedQuizObject;
        const [isLoading, setIsLoading] = useState(false);
        const navigate = useNavigate();
        //console.log('userAuth', userAuth);
        //console.log('session user',JSON.parse(sessionStorage.getItem('user')));
        //console.log()
        //   const router = useRouter();

        
        // function createNewQuiz() {
        //     const isValid = validateQuiz(newQuiz);
        //         if (isValid.valid === false) {
        //           toast.error(isValid.message);
        //           return;
        //         }
        //    // setAllQuizzers([...allQuizzes, newQuiz])
            

        // }

          async function createNewQuiz() {
    try {
      debugger;
      setIsLoading(true);
      const isValid = validateQuiz(newQuiz);
      if (isValid.valid === false) {
        toast.error(isValid.message);
        return;
      }
      const userData = JSON.parse(sessionStorage.getItem('user'));
      if (!userData || !userData.user || !userData.user._id) {
        toast.error('User session not found. Please login again.');
        return;
      }

      // Prepare quiz data according to the exam model schema
      const quizData = {
        title: newQuiz.quizName,
        description: newQuiz.quizDescription,
        icon: faCode.iconName,
        totalQuizAttemptsAllowed: parseInt(newQuiz.quizAttempts),
        quizDuration: parseInt(newQuiz.quizTime),
        createdBy: userData.user._id,
        quizQuestions: quizQuestions.map(q => ({
          mainQuestion: q.mainQuestion,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0
          }
        }))
      };

      const response = await axios.post(`${baseUrl}/api/exam/createNew`, quizData);

      if (response.status === 200) {
        const savedQuiz = response.data.data;
        // Update the quiz with the returned ID and preserve the title field
        const updatedQuiz = { 
          ...newQuiz, 
          _id: savedQuiz._id,
          title: savedQuiz.title, // Ensure title is preserved
          quizName: savedQuiz.title, // Keep quizName in sync
          createdBy: savedQuiz.createdBy,
          quizQuestions: savedQuiz.quizQuestions 
        };

        setAllQuizzes([...allQuizzes, updatedQuiz]);
        toast.success('Quiz created successfully!');
        window.location.href = '/AllQuiz';
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveQuiz() {
    const isValid = validateQuiz(newQuiz);
    if (isValid.valid === false) {
      toast.error(isValid.message);
      return;
    }

    try {
      setIsLoading(true);

      // Get user data from session storage and validate
      const userData = JSON.parse(sessionStorage.getItem('user'));
      if (!userData || !userData.user || !userData.user._id) {
        toast.error('User session not found. Please login again.');
        return;
      }

      // Prepare quiz data according to the exam model schema
      const quizData = {
        title: newQuiz.quizName,
        description: newQuiz.quizDescription,
        icon: faCode.iconName,
        totalQuizAttemptsAllowed: parseInt(newQuiz.quizAttempts),
        quizDuration: parseInt(newQuiz.quizTime),
        createdBy: userData.user._id, // Using the validated user ID
        quizQuestions: quizQuestions.map(q => ({
          mainQuestion: q.mainQuestion,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0
          }
        }))
      };

      if (selectedQuiz) {
        // Update existing quiz
        const response = await axios.post(`${baseUrl}/api/exam/update/${selectedQuiz.id}`, quizData);

        debugger;
        if (response.status === 200) {
          const updatedQuizdata = response.data.data;

          // Create the updated quiz object
    const updatedQuiz = {
      ...newQuiz,
      _id: updatedQuizdata._id,
      title: updatedQuizdata.title, // Ensure title is preserved
      quizName: updatedQuizdata.title, // Keep quizName in sync
      createdBy: updatedQuizdata.createdBy,
      quizQuestions: updatedQuizdata.quizQuestions,
      icon: newQuiz.icon, // Preserve the existing icon
      totalQuizAttemptsAllowed: newQuiz.quizAttempts, // Preserve attempts
    };

    // Update the state with the modified quiz
    setAllQuizzes((prevQuizzes) => {
      return prevQuizzes.map((quiz) => {
        if (quiz._id === updatedQuiz._id) {
          return {
            ...quiz,
            ...updatedQuiz, // Merge updated properties
          };
        }
        return quiz;
      });
    });

    toast.success('Quiz updated successfully!');
    window.location.href = '/AllQuiz';
          


        
          // setAllQuizzes(prevQuizzes => 
          //   prevQuizzes.map(quiz => 
          //     quiz._id === updatedQuiz._id ? {
          //       ...updatedQuiz,
          //       createdBy: quiz.createdBy // Keep existing creator info
          //     } : quiz
          //   )
          // );
          // toast.success('Quiz updated successfully!');
          // navigate('/AllQuiz');
        }
      } else {
        // Create new quiz
        await createNewQuiz();
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to save quiz');
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackButtonClick() {
    setNewQuiz({}); // Reset newQuiz state if needed
    setSelectedQuiz(null); // Reset selected quiz if needed
    //setSelectedQuizObject({}); // Reset selected quiz object if needed
    //setAllQuizzes([]); // Reset all quizzes if needed
    toast.success('Navigated to main page!');
    setIsLoading(false); // Reset loading state if needed
    window.location.href = '/AllQuiz'; // Navigate to main page
  }

            
                
   
    return (
        <motion.div className="poppins my-12 flex justify-between items-center "
        initial="hidden"
        animate="visible"
        transition={{ duration: 1 }}
        variants={{
          hidden: { opacity: 0, y: -70 },
          visible: { opacity: 1, y: 0 },
        }}        
        >
            <div className="flex gap-2 items-center">


                <Img src="/quiz-builder-icon.png" alt="" height={50} width={50} />
                <span className="text-2xl">Quiz Builder</span>

            </div>
            <div>
            <button  onClick={() => {
                  handleBackButtonClick();
            }}
                className="p-2 px-4 mr-2 bg-red-700 rounded-md text-white"
                >
              Back
            </button>
            <button
        onClick={() => {
          saveQuiz();
        }}
        className="p-2 px-4 bg-green-700 rounded-md text-white"
      >
        {isLoading ? 'Loading...' : 'Save'}
      </button>
      </div>
        </motion.div>
    );
}


function validateQuiz(newQuiz) {
  debugger;
    if (newQuiz.quizName.trim(' ').length === 0) {
        return { valid: false, message: 'Please add a name for the quiz!' };
        
      }
      if (newQuiz.quizDescription.trim(' ').length === 0) {
        return { valid: false, message: 'Please add a description for the quiz!' };
          
        }
        if (newQuiz.quizTime.toString().trim(' ') == '') {
            return { valid: false, message: 'Please add the duration for the quiz!' };
          
        }
        if (newQuiz.quizAttempts.toString().trim(' ') == '') {
            return { valid: false, message: 'Please add no of attempts allowed for the quiz!' };          
        }
  for (let question of newQuiz.quizQuestions) {
    // Check if the main question is empty
    if (!question.mainQuestion.trim()) {
      return { valid: false, message: 'Please fill in the main question.' };
    }

    // Check if any choice is empty
    if (question.choices.some((choice) => !choice.trim().substring(2))) {
      return { valid: false, message: 'Please fill in all choices.' };
    }

    // Check if the correct answer is empty
    if (question.correctAnswer === ''|| question.correctAnswer === -1) {
      return { valid: false, message: 'Please specify the correct answer.' };
    }
  }
  return { valid: true };
}

// function QuizBuildNav({ newQuiz, setNewQuiz }) {
//   const { allQuizzes, setAllQuizzes, selectedQuizObject } =
//     useGlobalContextProvider();

//   const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   async function createNewQuiz() {
//     try {
//       setIsLoading(true);
//       const textIcon = convertFromFaToText(newQuiz.icon);
//       const quizWithTextIcon = {
//         ...newQuiz,
//         icon: textIcon,
//       };

//       const res = await fetch('http://localhost:3000/api/quizzes', {
//         method: 'POST',
//         headers: {
//           'Content-type': 'application/json',
//         },
//         body: JSON.stringify(quizWithTextIcon), // Adding the new quiz to the db
//       });

//       if (!res.ok) {
//         toast.error('Failed to create a new quiz!');
//         setIsLoading(false);
//         return;
//       }

//       const { id } = await res.json();
//       console.log(id);
//       // Update the _id property of the newQuiz object
//       const updatedQuiz = { ...newQuiz, _id: id, icon: textIcon };

//       setAllQuizzes([...allQuizzes, updatedQuiz]);

//       toast.success('The quiz has been created successfully!');
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function saveQuiz() {
//     if (newQuiz.quizTitle.trim(' ').length === 0) {
//       return toast.error('Please add a name for the quiz!');
//     }

//     const isValid = validateQuizQuestions(newQuiz.quizQuestions);
//     if (isValid.valid === false) {
//       toast.error(isValid.message);
//       return;
//     }

//     if (selectedQuiz) {
//       const updatedQuiz = [...allQuizzes]; // Assuming allQuizzes contains the current state of quizzes
//       const findIndexQuiz = updatedQuiz.findIndex(
//         (quiz) => quiz._id === newQuiz._id,
//       );

//       if (findIndexQuiz !== -1) {
//         updatedQuiz[findIndexQuiz] = newQuiz;
//       }
//       const id = updatedQuiz[findIndexQuiz]._id;
//       //
//       const convertIconText = convertFromFaToText(
//         updatedQuiz[findIndexQuiz].icon,
//       );
//       console.log(updatedQuiz[findIndexQuiz]);
//       updatedQuiz[findIndexQuiz].icon = convertIconText;
//       try {
//         const res = await fetch(`http://localhost:3000/api/quizzes?id=${id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-type': 'application/json',
//           },
//           body: JSON.stringify({
//             updateQuiz: updatedQuiz[findIndexQuiz],
//           }),
//         });

//         if (!res.ok) {
//           throw new Error('Failed to update quiz');
//         }

//         toast.success('The quiz has been saved successfully.');
//         setAllQuizzes(updatedQuiz);
//       } catch (error) {}
//     } else {
//       createNewQuiz();

//       router.push('/'); // Navigate to main page
//     }
//   }

//   return (
//     <div className="poppins my-12 flex justify-between items-center ">
//       <div className="flex gap-2 items-center">
//         <Image src="/quiz-builder-icon.png" alt="" height={50} width={50} />
//         <span className="text-2xl">
//           Quiz <span className="text-green-700 font-bold">Builder</span>
//         </span>
//       </div>
//       <button
//         onClick={() => {
//           saveQuiz();
//         }}
//         className="p-2 px-4 bg-green-700 rounded-md text-white"
//       >
//         {isLoading ? 'Loading...' : 'Save'}
//       </button>
//     </div>
//   );
// }

export default QuizBuildNav;
