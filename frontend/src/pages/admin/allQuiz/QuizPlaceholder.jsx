import React from 'react';
import { Img } from 'react-image';
//import useGlobalContextProvider from '../ContextApi';
//import { useRouter } from 'next/navigation';

function PlaceHolder(props) {
    //   const { userObject } = useGlobalContextProvider();
    //   const { user, setUser } = userObject;
     // const router = useRouter();
      return (
        <div className="poppins flex-col gap-3   p-4 flex justify-center items-center  ">
          {/* Icon Container */}
          <Img src="/emptyBox.png" alt="" width={130} height={130} />
          {/* Title */}
          <h2 className="text-2xl font-bold">Quizzes await! You're here early.</h2>
          {/* Call To Action */}
          <span className="text-[13px] font-light">
            Please get in touch with the administrator to take quiz...
          </span>
         
        </div>
      );
    }

    //for admin use this if empty
// function PlaceHolder(props) {
// //   const { userObject } = useGlobalContextProvider();
// //   const { user, setUser } = userObject;
//  // const router = useRouter();
//   return (
//     <div className="poppins flex-col gap-3   p-4 flex justify-center items-center  ">
//       {/* Icon Container */}
//       <Img src="/emptyBox.png" alt="" width={130} height={130} />
//       {/* Title */}
//       <h2 className="text-2xl font-bold">Quizzes await! Make one.</h2>
//       {/* Call To Action */}
//       <span className="text-[13px] font-light">
//         Click below to begin your journey here...
//       </span>
//       {/* button */}
//       <button
//         onClick={() => {
//           //router.push('/quiz-build');
//         }}
//         className="p-3 px-4 text-white text-[12px] bg-green-700 rounded-md"
//       >
//         Create my first Quiz
//       </button>
//     </div>
//   );
// }

export default PlaceHolder;
