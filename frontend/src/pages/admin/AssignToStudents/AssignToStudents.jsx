import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {motion} from 'framer-motion';

export default function AssignToStudents() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [students, setStudents] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
                const response = await axios.get(`${baseUrl}/api/exam/getAllExams`);
                setQuizzes(response.data.data);
            } catch (error) {
                toast.error('Failed to fetch quizzes:', error);
            }
        }
        fetchQuizzes();
    }, []);

    useEffect(() => {
        async function fetchUsersAndAssignments() {
            try {
                const baseUrl = String(import.meta.env.VITE_API_BASE_URL);

                const usersResponse = await axios.get(`${baseUrl}/api/admin/users`);
                const { users } = usersResponse.data;

                if (selectedQuiz) {
                    const assignedResponse = await axios.get(`${baseUrl}/api/admin/assignedStudents`, {
                        params: { quizId: selectedQuiz._id },
                    });
                    const { assignedStudents: assigned } = assignedResponse.data;

                    const assignedIds = new Set(assigned.map(student => student._id));
                    setStudents(users.filter(user => !assignedIds.has(user._id)));
                    setAssignedStudents(assigned);

                    if (assigned.length > 0) {
                        toast(`There are already ${assigned.length} students assigned to this quiz.`);
                    }
                } else {
                    setStudents(users);
                    setAssignedStudents([]);
                }
            } catch (error) {
                toast.error('Error fetching users or assignments:', error);
            }
        }

        fetchUsersAndAssignments();
    }, [selectedQuiz]);

    const handleQuizChange = (event) => {
        const quizId = event.target.value;
        const quiz = quizzes.find(q => q._id === quizId);
        setSelectedQuiz(quiz);
        setAssignedStudents([]);
        setStudents([]);
        async function fetchUsers() {
            try {
                const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
                const response = await axios.get(`${baseUrl}/api/admin/users`);
                const { users } = response.data;
                setStudents(users);
            } catch (error) {
                toast.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    };

    const assignStudent = async(student) => {
        if (!selectedQuiz) {
            toast.error('Please select a quiz before assigning students.');
            return;
        }
        setStudents(prev => prev.filter(s => s._id !== student._id));
        setAssignedStudents(prev => [...prev, student]);
        try {
            const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
            const response = await axios.post(`${baseUrl}/api/admin/assignQuiztoStudent`, {
                quizId: selectedQuiz._id,
                studentId: student._id,
                quizAttemptsLeft: selectedQuiz.totalQuizAttemptsAllowed,
            });

            if (response.status === 200) {
                toast.success('Students successfully assigned to the quiz!');
            } else {
                toast.error('Failed to assign students to the quiz.');
            }
        } catch (error) {
            console.error('Error assigning students to quiz:', error);
            toast.error('An error occurred while assigning students.');
        }
    };

    const unassignStudent = async(student) => {
        setAssignedStudents(prev => prev.filter(s => s._id !== student._id));
        setStudents(prev => [...prev, student]);
        try {
            const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
            const response = await axios.post(`${baseUrl}/api/admin/unassignQuizfromStudent`, {
                quizId: selectedQuiz._id,
                studentId: student._id,
            });

            if (response.status === 200) {
                toast.success('Students successfully unassigned from the quiz!');
            } else {
                toast.error('Failed to unassign students from the quiz.');
            }
        } catch (error) {
            console.error('Error unassigning students from quiz:', error);
            toast.error('An error occurred while unassigning students.');
        }
    };
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <motion.div className="bg-white shadow-md rounded-lg p-4 mb-6"
             initial='hidden'
             whileInView='visible'
             viewport={{ once: true, amount: 0.5 }}
             transition={{ duration: 1.5 }}
             variants={{
               hidden: { opacity: 0, y: 150 },
               visible: { opacity: 1, y: 0 },
             }}
            >
                <label htmlFor="quiz" className="block text-lg font-semibold mb-2">Select Quiz:</label>
                <select
                    id="quiz"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleQuizChange}
                >
                    <option value="">Select a quiz</option>
                    {quizzes.map(quiz => (
                        <option key={quiz._id} value={quiz._id}>{quiz.title}</option>
                    ))}
                </select>
            </motion.div>
    
            <div className="grid grid-cols-2 gap-6">
                {/* Available Students */}
                <motion.div className="bg-white shadow-md rounded-lg p-4"
                 initial='hidden'
                 whileInView='visible'
                 viewport={{ once: true, amount: 0.5 }}
                 transition={{ duration: 1.2 }}
                 variants={{
                   hidden: { opacity: 0, x: -100 },
                   visible: { opacity: 1, x: 0 },
                 }}
                >
                    <h2 className="text-lg font-bold mb-3">Available Students</h2>
                    <div className="min-h-[300px] p-3 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                        {students.map(student => (
                            <motion.div key={student._id} className="flex items-center justify-between p-2 border-b"
                            initial='hidden'
                 whileInView='visible'
                 viewport={{ once: true, amount: 0.5 }}
                 transition={{ duration: 1.6 }}
                 variants={{
                   hidden: { opacity: 0, y: 100 },
                   visible: { opacity: 1, y: 0 },
                 }}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={student.profile_img || '/default-profile.png'}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="font-medium text-sm">{student.username}</span>
                                </div>
                                <button
                                    onClick={() => assignStudent(student)}
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    Assign
                                </button>
                            </motion.div>
                        ))}
                        {students.length === 0 && (
                            <p className="text-gray-400 text-center mt-8 text-sm">No students available</p>
                        )}
                    </div>
                </motion.div>
    
                {/* Assigned Students */}
                <motion.div className="bg-white shadow-md rounded-lg p-4"
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.2 }}
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <h2 className="text-lg font-bold mb-3">
                        {selectedQuiz ? `Assigning to: ${selectedQuiz.title}` : 'Select a Quiz'}
                    </h2>
                    <div className="min-h-[300px] p-3 border border-green-400 rounded-lg bg-gray-50 overflow-y-auto">
                        {assignedStudents.map(student => (
                            <motion.div key={student._id} className="flex items-center justify-between p-2 border-b"
                            initial='hidden'
                 whileInView='visible'
                 viewport={{ once: true, amount: 0.5 }}
                 transition={{ duration: 1.6 }}
                 variants={{
                   hidden: { opacity: 0, y: 100 },
                   visible: { opacity: 1, y: 0 },
                 }}>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={student.profile_img || '/default-profile.png'}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="font-medium text-sm">{student.username}</span>
                                </div>
                                <button
                                    onClick={() => unassignStudent(student)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Unassign
                                </button>
                            </motion.div>
                        ))}
                        {assignedStudents.length === 0 && (
                            <p className="text-gray-400 text-center mt-8 text-sm">No students assigned</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
    

    
}
