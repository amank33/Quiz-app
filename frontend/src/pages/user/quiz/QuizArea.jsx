// import QuizCard from './QuizCard';
import PlaceHolder from './QuizPlaceholder';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import { Img } from 'react-image';
import QuizCard from './QuizCard';
import { all } from 'axios';
import { useEffect,useState } from 'react';
import { motion } from "framer-motion";
// import { useRouter } from 'next/navigation';
// import DropDown from './DropDown';

function QuizArea() {
  const [loadQuizzes, setLoadQuizzes] = useState([]);
  const { allQuizzes, isLoadingObject } = useGlobalContextProvider();
  //console.log(allQuizzes,'allQuizzes');
  
  //console.log(JSON.parse(sessionStorage.getItem('user'))?.user?.enrolledExams,'enrolledexams')
   

  useEffect(() => {
  
  const user = JSON.parse(sessionStorage.getItem('user'))?.user;
  const enrolledExams = user?.enrolledExams || [];
  debugger;

  const filteredQuizzes = allQuizzes.filter((quiz) =>
    enrolledExams.some((enrolledQuiz) => enrolledQuiz.examId === quiz.id)
  );
  filteredQuizzes.forEach((quiz) => {
    quiz.totalQuizAttemptsAllowed = enrolledExams.find(
      (enrolledQuiz) => enrolledQuiz.examId === quiz.id
    ).quizAttemptsLeft;
    quiz.quizAttemptsLeft = enrolledExams.find(
      (enrolledQuiz) => enrolledQuiz.examId === quiz.id
    ).quizAttemptsLeft;
    quiz.totalQuizAttempts = enrolledExams.find(
      (enrolledQuiz) => enrolledQuiz.examId === quiz.id
    ).totalAttempts;
    quiz.score = enrolledExams.find(
      (enrolledQuiz) => enrolledQuiz.examId === quiz.id
    ).score;
  });
  console.log(enrolledExams,'enrolledExams')
  console.log(filteredQuizzes,'filteredQuizzes')

  setLoadQuizzes(filteredQuizzes);

  }, [allQuizzes]);


  return (
    <motion.div className="container mx-auto px-4 py-8"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 1 }}
    variants={{
      hidden: { opacity: 0, y: -100 },
      visible: { opacity: 1, y: 0 },
    }}    
    >    
      {loadQuizzes.length === 0 ? (
        <PlaceHolder />
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {loadQuizzes.map((singleQuiz, quizIndex) => (
            <div key={quizIndex} className="flex">
              <QuizCard singleQuiz={singleQuiz} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// function QuizArea({ props }) {
//   const { allQuizzes, userObject, isLoadingObject } =
//     useGlobalContextProvider();
//   const router = useRouter();
//   const { user, setUser } = userObject;
//   const { isLoading } = isLoadingObject;
//   console.log(isLoading);
//   return (
//     <div className="mx-12 mt-10">
//       <div>
//         {isLoading ? (
//           <div></div>
//         ) : user.isLogged ? (
//           <>
//             {allQuizzes.length === 0 ? (
//               <PlaceHolder />
//             ) : (
//               <div>
//                 <DropDown />
//                 <h2 className="text-xl font-bold">My Quizzes</h2>
//                 <div className="mt-6 flex gap-2 flex-wrap">
//                   <div className="flex gap-2 flex-wrap">
//                     {allQuizzes.map((singleQuiz, quizIndex) => (
//                       <div key={quizIndex}>
//                         <QuizCard singleQuiz={singleQuiz} />
//                       </div>
//                     ))}
//                   </div>
//                   <div
//                     onClick={() => router.push('/quiz-build')}
//                     className=" cursor-pointer justify-center items-center rounded-[10px]
//                    w-[230px] flex flex-col gap-2 border border-gray-100 bg-white p-4"
//                   >
//                     <Image
//                       src={'/add-quiz.png'}
//                       width={160}
//                       height={160}
//                       alt=""
//                     />
//                     <span className="select-none opacity-40">
//                       Add a new Quiz
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="  h-96 flex flex-col gap-4 justify-center items-center">
//             <h2 className="font-bold text-5xl">
//               Learn 10x <span className="text-green-700">Faster!</span>
//             </h2>
//             <span className="text-xl font-light">
//               Unlock Your Potential with Personalized Quizzes
//             </span>
//             <button
//               onClick={() => {
//                 setUser((prevUser) => ({ ...prevUser, isLogged: true }));
//               }}
//               className="p-4 bg-green-700 text-white rounded-md"
//             >
//               Get Started Now!
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export default QuizArea;
