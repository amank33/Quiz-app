import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import useGlobalContextProvider from '../../../hooks/ContextApi';
import convertToFaIcons from '../../../helper/convertToFaIcons';
import toast, { Toaster } from 'react-hot-toast';
import {motion} from 'framer-motion';

function QuizBuildTitle({focusProp,quizHeader, setQuizHeader}) {
    const { focus, setFocusFirst } = focusProp;
    console.log('Quiz Header:', quizHeader);  

    
    const quizHeaderRef = useRef({
        quizName: null,
        quizDescription: null,
        quizTime: null,
        quizAttempts: null,
    });

    const handleInputChange = (field, value) => {
        setQuizHeader((prev) => {
            const updated = {
                ...prev,
                [field]: value,
            };
            if (field === 'quizName') {
                updated.title = value; // Keep title in sync with quizName
            }
            return updated;
        });
    };

    useEffect(() => {
        if (focus) {
            quizHeaderRef.current.quizName.focus();
        }
    }, [focus]);

    return (
        <motion.div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border border-green-700 rounded-lg shadow-md "
        initial="hidden"
        animate="visible"
        transition={{ duration: 1 }}
        variants={{
          hidden: { opacity: 0, y: -70 },
          visible: { opacity: 1, y: 0 },
        }}
        >
            <div className="flex items-center gap-4">
                <div className="bg-green-700 px-4 py-1 rounded-md text-white font-bold">1</div>
                <span className="font-bold text-gray-700">Quiz Name:</span>
                <input
                    ref={(el) => (quizHeaderRef.current.quizName = el)}
                    value={quizHeader.quizName}
                    onChange={(e) => handleInputChange('quizName', e.target.value)}
                    className="flex-1 outline-none border-b-2 border-gray-300 focus:border-green-700 transition-all text-sm px-2 py-1"
                    placeholder="Enter the Name Of The Quiz..."
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">Quiz Description:</span>
                <textarea
                    ref={(el) => (quizHeaderRef.current.quizDescription = el)}
                    value={quizHeader.quizDescription}
                    onChange={(e) => handleInputChange('quizDescription', e.target.value)}
                    className="flex-1 outline-none border-b-2 border-gray-300 focus:border-green-700 transition-all text-sm px-2 py-1 resize-none"
                    placeholder="Enter the description Of The Quiz..."
                    rows="3"
                ></textarea>
            </div>
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">Quiz Time (in minutes):</span>
                <select
                    ref={(el) => (quizHeaderRef.current.quizTime = el)}
                    value={quizHeader.quizTime || ""}
                    onChange={(e) => handleInputChange('quizTime', e.target.value)}
                    className="flex-1 outline-none border-b-2 border-gray-300 focus:border-green-700 transition-all text-sm px-2 py-1"
                >
                    <option value="" disabled>
                        Select time for the quiz...
                    </option>
                    {[5, 10, 15, 20, 30, 45, 60].map((time) => (
                        <option key={time} value={time}>
                            {time} minutes
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">Quiz Attempts Allowed:</span>
                <select
                    ref={(el) => (quizHeaderRef.current.quizAttempts = el)}
                    value={quizHeader.quizAttempts || ""}
                    onChange={(e) => handleInputChange('quizAttempts', e.target.value)}
                    className="flex-1 outline-none border-b-2 border-gray-300 focus:border-green-700 transition-all text-sm px-2 py-1"
                >
                    <option value="" disabled>
                        Select number of attempts...
                    </option>
                    {[1, 2, 3, 4, 5].map((attempt) => (
                        <option key={attempt} value={attempt}>
                            {attempt} {attempt === 1 ? 'attempt' : 'attempts'}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end col-span-1 md:col-span-2">
                <FontAwesomeIcon
                    onClick={() => {
                        console.log('Quiz Header Data:', quizHeader);
                        console.log('Quiz Header Refs:', quizHeaderRef.current);
                    }}
                    icon={faCode}
                    height={40}
                    width={40}
                    className="text-white p-2 rounded-md bg-green-700 cursor-pointer hover:bg-green-800 transition-all"
                />
            </div>
        </motion.div>
    );
}



function QuizBuildTitle1({ focusProp, onChangeQuizTitle }) {
  const { openBoxToggle, selectedIconObject, selectedQuizObject } =
    useGlobalContextProvider();
  const { selectedQuiz } = selectedQuizObject;
  const [quizTitle, setQuizTitle] = useState(() => {
    return selectedQuiz ? selectedQuiz.quizTitle : '';
  });
  const { focus } = focusProp;
  const quizTitleRef = useRef(null);

  const { openIconBox, setOpenIconBox } = openBoxToggle;
  const { selectedIcon, setSelectedIcon } = selectedIconObject;

  function handleTextInputChange(text) {
    setQuizTitle(text);
    onChangeQuizTitle(text);
  }

  useEffect(() => {
    if (focus) {
      quizTitleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (typeof selectedIcon.faIcon === 'string') {
      const newFaIcon = convertToFaIcons(selectedIcon.faIcon);
      const copySelectedIcon = { ...selectedIcon };
      copySelectedIcon.faIcon = newFaIcon;
      setSelectedIcon(copySelectedIcon);
    }
  }, []);

  return (
    <div className="p-3 flex justify-between border border-green-700 rounded-md">
      <div className="flex gap-2">
        <div className="flex gap-2 items-center">
          <div className="bg-green-700 px-4 py-1 rounded-md text-white">1</div>
          <span className="font-bold">Quiz Name : </span>
        </div>
        <input
          onChange={(e) => {
            handleTextInputChange(e.target.value);
          }}
          value={quizTitle}
          ref={quizTitleRef}
          className="outline-none border-b-2 pt-1 w-[300px] text-[13px]"
          placeholder="Enter the Name Of The Quiz..."
        />
      </div>
      <FontAwesomeIcon
        onClick={() => {
          setOpenIconBox(true);
        }}
        icon={selectedIcon.faIcon}
        height={40}
        width={40}
        className="text-white p-2 rounded-md bg-green-700 cursor-pointer"
      />
    </div>
  );
}

export default QuizBuildTitle;
