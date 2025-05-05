
import React, { useState, useEffect } from 'react';
import QuizBuildNav from './QuizBuildNav';
import QuizBuildTitle from './QuizBuildTitle';
import QuizBuildQuestions from './QuizBuildQuestions';
//import { v4 as uuidv4 } from 'uuid';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';
// import IconsComponents from './IconsComponents';
import { v4 as uuidv4 } from 'uuid';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import{motion} from 'framer-motion';

function Page() {
  const [focusFirst, setFocusFirst] = useState(true);
  const prefixes = ['A', 'B', 'C', 'D'];
  const { userAuth,allQuizzes, setAllQuizzes, selectedQuizObject } =
          useGlobalContextProvider();
          const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;
          console.log('Selected Quiz:', selectedQuiz);

  
  const [quizHeader, setQuizHeader] = useState(()=>{
    if (selectedQuiz) {
      return {
        quizName: selectedQuiz.quizTitle,
        quizDescription: selectedQuiz.quizDescription,
        quizTime: selectedQuiz.quizDuration,
        quizAttempts: selectedQuiz.totalQuizAttemptsAllowed,
        
    };
    } else {
      return [
        {
          quizName: '',
          quizDescription: '',
          quizTime: '',
          quizAttempts: '',
      }]}});
      
        const [quizQuestions, setQuizQuestions] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz.quizQuestions;
    } else {
      return [
        {
          id: uuidv4(),
          mainQuestion: '',
          choices: prefixes.slice(0, 2).map((prefix) => prefix + '. '),
          correctAnswer: '',
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
      ];
    }
  });
//     const [quizQuestions, setQuizQuestions] = useState([
//     {
//         id: uuidv4(),
//         mainQuestion: '',
//         choices: ['A. ', 'B. '],
//         correctAnswer: '',
//         answeredResult: -1,
//         statistics: {
//             totalAttempts: 0,
//             correctAttempts: 0,
//             incorrectAttempts: 0,
//         },
//     },
// ]);
  const [newQuiz, setNewQuiz] = useState(() => {
    // if (selectedQuiz) {
    //   return selectedQuiz;
    // } else {
    debugger;
      return {
        _id: '',
        icon: faCode,
       // icon: selectedIcon.faIcon,
        ...quizHeader,
        quizQuestions: quizQuestions,
      };
   // }
  });

    useEffect(() => {
      debugger;
    setNewQuiz((prevQuiz) => ({
      ...prevQuiz,
      icon: faCode,
      ...quizHeader,
      //icon: selectedIcon.faIcon,
      quizQuestions: quizQuestions,
    }));
  }, [quizQuestions, quizHeader]);

    const quizNavBarProps = {
      quizHeader,
    quizQuestions,
    newQuiz,
    setNewQuiz,
  };

    const quizTitleProps = {
    focusProp: { focus: focusFirst, setFocusFirst },
    //onChangeQuizTitle,
    quizHeader, setQuizHeader,
  };

  const quizQuestionsProps = {
    focusProp: { focus: !focusFirst, setFocusFirst },
    quizQuestions,
    setQuizQuestions,
  };

  return (
    <div className="relative mx-16 poppins"
    // initial='hidden'
    //       whileInView='visible'
    //       viewport={{ once: true, amount: 0.5 }}
    //       transition={{ duration: 1 }}
    //       variants={{
    //         hidden: { opacity: 0, y: -100 },
    //         visible: { opacity: 1, y: 0 },
    //       }}
    >
      <QuizBuildNav {...quizNavBarProps}/>
      <QuizBuildTitle {...quizTitleProps} />
      <QuizBuildQuestions {...quizQuestionsProps} />
    </div>
  );
}

// function Page1(props) {
//   const prefixes = ['A', 'B', 'C', 'D'];
//   const { selectedIconObject, selectedQuizObject } = useGlobalContextProvider();
//   const { selectedIcon } = selectedIconObject;
//   const { selectedQuiz } = selectedQuizObject;
//   const [focusFirst, setFocusFirst] = useState(true);



//   const [newQuiz, setNewQuiz] = useState(() => {
//     if (selectedQuiz) {
//       return selectedQuiz;
//     } else {
//       return {
//         _id: '',
//         icon: selectedIcon.faIcon,
//         quizTitle: '',
//         quizQuestions: quizQuestions,
//       };
//     }
//   });

//   console.log(newQuiz);

//   useEffect(() => {
//     setNewQuiz((prevQuiz) => ({
//       ...prevQuiz,
//       icon: selectedIcon.faIcon,
//       quizQuestions: quizQuestions,
//     }));
//   }, [quizQuestions, selectedIcon.faIcon]);

//   function onChangeQuizTitle(text) {
//     setNewQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle: text }));
//   }

//   const quizNavBarProps = {
//     quizQuestions,
//     newQuiz,
//     setNewQuiz,
//   };

//   const quizTitleProps = {
//     focusProp: { focus: focusFirst, setFocusFirst },
//     onChangeQuizTitle,
//   };

//   const quizQuestionsProps = {
//     focusProp: { focus: !focusFirst, setFocusFirst },
//     quizQuestions,
//     setQuizQuestions,
//   };

//   return (
//     <div className=" relative mx-16 poppins">
//       <IconsComponents />
//       <QuizBuildNav {...quizNavBarProps} />
//       <QuizBuildTitle {...quizTitleProps} />
//       <QuizBuildQuestions {...quizQuestionsProps} />
//     </div>
//   );
// }


export default Page;
