import PlaceHolder from './QuizPlaceholder';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import { Img } from 'react-image';
import QuizCard from './QuizCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {motion} from 'framer-motion';

function QuizArea() {
  const { allQuizzes, isLoadingObject } = useGlobalContextProvider();
  const navigate = useNavigate();
  
  
  return (
    <motion.div className="container mx-auto px-4 py-8 flex justify-center items-center"
    initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          variants={{
            hidden: { opacity: 0, y: -100 },
            visible: { opacity: 1, y: 0 },
          }}
    >    
      {/* {allQuizzes.length === 0 ? (
        <PlaceHolder />
      ) : ( */}
        <div className="mt-6 flex gap-4 flex-wrap items-stretch">  
          <motion.div className="flex gap-4 flex-wrap items-stretch"
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.5 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
          >
            {allQuizzes.length > 0 && allQuizzes.map((singleQuiz, quizIndex) => (
              <div key={quizIndex} className="w-[250px] h-[320px]">
                <QuizCard singleQuiz={singleQuiz} />
              </div>
            ))}
          </motion.div>
          <motion.div
            onClick={() => navigate('/quiz-build')}
            className="cursor-pointer justify-center items-center rounded-lg w-[250px] h-[320px] flex flex-col gap-4 border border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
          >
            <Img
              src={'/add-quiz.png'}
              width={160}
              height={130}
              alt="Add a new Quiz"
            />
            <span className="text-gray-500 font-medium">Add a new Quiz</span>
          </motion.div>
        </div>
        
      {/* )} */}
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
