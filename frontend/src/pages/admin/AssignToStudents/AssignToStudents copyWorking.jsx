import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


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
                console.error('Failed to fetch quizzes:', error);
            }
        }
        fetchQuizzes();
    }, []);

    useEffect(() => {
        async function fetchUsersAndAssignments() {
            try {
                const baseUrl = String(import.meta.env.VITE_API_BASE_URL);

                // Fetch all users
                const usersResponse = await axios.get(`${baseUrl}/api/admin/users`);
                const { users } = usersResponse.data;

                // Fetch assigned students for the selected quiz
                if (selectedQuiz) {
                    const assignedResponse = await axios.get(`${baseUrl}/api/admin/assignedStudents`, {
                        params: { quizId: selectedQuiz._id },
                    });
                    const { assignedStudents: assigned } = assignedResponse.data;

                    // Filter users into available and assigned
                    const assignedIds = new Set(assigned.map(student => student._id));
                    setStudents(users.filter(user => !assignedIds.has(user._id)));
                    setAssignedStudents(assigned);

                    // Show a pop-up if there are already assigned students
                    if (assigned.length > 0) {
                        toast(`There are already ${assigned.length} students assigned to this quiz.`);
                    }
                } else {
                    setStudents(users);
                    setAssignedStudents([]);
                }
            } catch (error) {
                console.error('Error fetching users or assignments:', error);
            }
        }

        fetchUsersAndAssignments();
    }, [selectedQuiz]);

    const handleQuizChange = (event) => {
        if (assignedStudents.length > 0) {
            const confirmChange = window.confirm(
                'Changing the quiz will omit the current assignments. Do you want to proceed?'
            );
            if (!confirmChange) {
                return; // Do not change the quiz if the user cancels
            }
        }

        const quizId = event.target.value;
        const quiz = quizzes.find(q => q._id === quizId);
        setSelectedQuiz(quiz);
        setAssignedStudents([]); // Reset assigned students when quiz changes
        setStudents([]); // Refresh available students box

        // Re-fetch students to refresh the available students box
        async function fetchUsers() {
            try {
                const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
                const response = await axios.get(`${baseUrl}/api/admin/users`);
                const { users } = response.data;
                setStudents(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    };

    const assignStudent = (student) => {
        if (!selectedQuiz) {
            alert('Please select a quiz before assigning students.');
            return;
        }
        setStudents(prev => prev.filter(s => s._id !== student._id));
        setAssignedStudents(prev => [...prev, student]);
    };

    const unassignStudent = (student) => {
        setAssignedStudents(prev => prev.filter(s => s._id !== student._id));
        setStudents(prev => [...prev, student]);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Assign Quiz to Students</h1>
            <div className="flex flex-col gap-4 mb-8">
                <label htmlFor="quiz" className="font-semibold">Select Quiz:</label>
                <select id="quiz" className="border border-gray-300 rounded p-2" onChange={handleQuizChange}>
                    <option value="">Select a quiz</option>
                    {quizzes.map(quiz => (
                        <option key={quiz._id} value={quiz._id}>{quiz.title}</option>
                    ))}
                </select>
                <button
                    onClick={async () => {
                        if (!selectedQuiz) {
                            alert('Please select a quiz before assigning students.');
                            return;
                        }

                        if (assignedStudents.length === 0) {
                            alert('No students assigned to the quiz.');
                            return;
                        }

                        try {
                            const baseUrl = String(import.meta.env.VITE_API_BASE_URL);
                            debugger;
                            const response = await axios.post(`${baseUrl}/api/admin/assignQuiz`, {
                                quizId: selectedQuiz._id,
                                students: assignedStudents.map(student => student._id),
                            });

                            if (response.status === 200) {
                                alert('Students successfully assigned to the quiz!');
                            } else {
                                alert('Failed to assign students to the quiz.');
                            }
                        } catch (error) {
                            console.error('Error assigning students to quiz:', error);
                            alert('An error occurred while assigning students.');
                        }
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Assign
                </button>
            </div>

            <div className="flex flex-row gap-8">
                {/* Available Students */}
                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-2">Available Students</h2>
                    <div className="min-h-[400px] p-4 border border-gray-300 rounded bg-gray-50">
                        {students.map(student => (
                            <div key={student._id} className="flex items-center justify-between p-2 border-b">
                                <span>{student.username}</span>
                                <button
                                    onClick={() => assignStudent(student)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Assign
                                </button>
                            </div>
                        ))}
                        {students.length === 0 && (
                            <p className="text-gray-400 text-center mt-16">No students available</p>
                        )}
                    </div>
                </div>

                {/* Assigned Students */}
                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-2">
                        {selectedQuiz ? `Assigning to: ${selectedQuiz.title}` : 'Select a Quiz'}
                    </h2>
                    <div className="min-h-[400px] p-4 border border-green-400 rounded bg-gray-50">
                        {assignedStudents.map(student => (
                            <div key={student._id} className="flex items-center justify-between p-2 border-b">
                                <span>{student.username}</span>
                                <button
                                    onClick={() => unassignStudent(student)}
                                    className="text-red-500 hover:underline"
                                >
                                    Unassign
                                </button>
                            </div>
                        ))}
                        {assignedStudents.length === 0 && (
                            <p className="text-gray-400 text-center mt-16">No students assigned</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
