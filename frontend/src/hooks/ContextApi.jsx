'use client';

import { createContext, use, useContext, useEffect, useState } from 'react';
import { quizzesData } from '../helper/QuizData';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { lookInSession } from '../common/session';
import axios from 'axios';

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false)
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [userAuth, setUserAuth] = useState({});
  const [userRole, setUserRole] = useState('user'); // 'admin' or 'student'
//   const [user, setUser] = useState({});
//   const [openIconBox, setOpenIconBox] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [selectedIcon, setSelectedIcon] = useState({ faIcon: faQuestion });

  // const [dropDownToggle, setDropDownToggle] = useState(false);
  // const [threeDotsPositions, setThreeDotsPositions] = useState({ x: 0, y: 0 });
  const [isLoading, setLoading] = useState(true);
  let baseUrl = String(import.meta.env.VITE_API_BASE_URL);

//   const [userXP, setUserXP] = useState(0);

useEffect(() => {
  
  let userInSession = lookInSession("user");
  userInSession
    ? setUserAuth(JSON.parse(userInSession))
    : setUserAuth({ acess_token: null });
  userInSession? setUserRole(JSON.parse(userInSession)?.user?.role) : setUserRole('user');
  
}, []);

  useEffect(() => { 
    // Fetch all quizzes
    const fetchAllQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/exam/getAllExams`);
        
        console.log(response.data.data, 'response.data.data');
        if (response.data.status) {
          // If the response is successful, set the quizzes data
          
          let quizzes = response.data.data.map((quiz) => {
            return {
              id: quiz._id,
              createdBy: quiz.createdBy,
              icon: quiz.icon || faQuestion,
              quizTitle: quiz.title,
              quizDescription: quiz.description,
              totalQuizAttempts: 0,
              totalQuizAttemptsAllowed: quiz.totalQuizAttemptsAllowed,
              quizDuration: quiz.quizDuration,
              quizQuestions: quiz.quizQuestions.map((question) => ({
                id: question._id,
                mainQuestion: question.mainQuestion,
                choices: question.choices.map((choice, index) => `${choice}`),
                correctAnswer: question.correctAnswer, // Adjusted to match the choices array
                answeredResult: -1,
                statistics: {
                  totalAttempts: 0,
                  correctAttempts: 0,
                  incorrectAttempts: 0,
                },
              })),
            };
          })
          setAllQuizzes(quizzes);
        } else {
          toast.error('Failed to fetch exams');
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast.error(error.response?.data?.message || 'Something went wrong...');
      } finally {
        setLoading(false);
      }
    }

    // Fetch the user

    fetchAllQuizzes();
   // setAllQuizzes(quizzesData);
    setLoading(false);
  }, []);

  //useEffect(() => {
    // const fetchUser = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3000/api/user', {
    //       method: 'POST',
    //       headers: {
    //         'Content-type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         name: 'quizUser',
    //         isLogged: false,
    //         experience: 0,
    //       }),
    //     });

    //     if (!response.ok) {
    //       toast.error('Something went wrong...');
    //       throw new Error('fetching failed...');
    //     }

    //     const userData = await response.json();
    //     console.log(userData);

    //     if (userData.message === 'User already exists') {
    //       // If user already exists, update the user state with the returned user
    //       setUser(userData.user);
    //     } else {
    //       // If user doesn't exist, set the newly created user state
    //       setUser(userData.user);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchUser();
  //}, []);

//   useEffect(() => {
//     setUser((prevUser) => ({
//       ...prevUser,
//       experience: userXP,
//     }));
//   }, [userXP]);

//   useEffect(() => {
//     if (selectedQuiz) {
//       setSelectedIcon({ faIcon: selectedQuiz.icon });
//     } else {
//       setSelectedIcon({ faIcon: faQuestion });
//     }
//   }, [selectedQuiz]);

  return (
    <GlobalContext.Provider
      value={{
        allQuizzes,
        setAllQuizzes,
        quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
        userAuth, setUserAuth,
        isSidenavOpen, setIsSidenavOpen,
        userRole, setUserRole,
        // userObject: { user, setUser },
        // openBoxToggle: { openIconBox, setOpenIconBox },
        // selectedIconObject: { selectedIcon, setSelectedIcon },
        // dropDownToggleObject: { dropDownToggle, setDropDownToggle },
        // threeDotsPositionsObject: { threeDotsPositions, setThreeDotsPositions },
        selectedQuizObject: { selectedQuiz, setSelectedQuiz },
        // userXpObject: { userXP, setUserXP },
        isLoadingObject: { isLoading, setLoading },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default function useGlobalContextProvider() {
  return useContext(GlobalContext);
}
