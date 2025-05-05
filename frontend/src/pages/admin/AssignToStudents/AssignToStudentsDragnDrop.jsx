import { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    }, []);

    const handleQuizChange = (event) => {
        const quizId = event.target.value;
        const quiz = quizzes.find(q => q._id === quizId);
        setSelectedQuiz(quiz);
        setAssignedStudents([]); // Reset assigned students when quiz changes
    };

    // Add debugging logs to track drag-and-drop events and state changes
    const onDragEnd = (result) => {
        const { source, destination } = result;
        console.log('Drag End Event:', result); // Log the drag event details

        if (!destination) {
            console.log('No destination specified');
            return;
        }

        // Drag from students to assigned
        if (source.droppableId === 'students' && destination.droppableId === 'assigned') {
            const student = students[source.index];
            console.log('Moving student from students to assigned:', student);
            setStudents(prev => prev.filter((_, idx) => idx !== source.index));
            setAssignedStudents(prev => [...prev, student]);
        }

        // Drag from assigned back to students
        if (source.droppableId === 'assigned' && destination.droppableId === 'students') {
            const student = assignedStudents[source.index];
            console.log('Moving student from assigned to students:', student);
            setAssignedStudents(prev => prev.filter((_, idx) => idx !== source.index));
            setStudents(prev => [...prev, student]);
        }
    };

    useEffect(() => {
        console.log('Quizzes fetched:', quizzes);
    }, [quizzes]);

    useEffect(() => {
        console.log('Students fetched:', students);
    }, [students]);

    useEffect(() => {
        console.log('Assigned students updated:', assignedStudents);
    }, [assignedStudents]);

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
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-row gap-8">
                    {/* Students List */}
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-2">Available Students</h2>
                        <Droppable droppableId="students">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="min-h-[400px] p-4 border border-gray-300 rounded bg-gray-50"
                                >
                                    {students.map((student, index) => (
                                        <Draggable key={student._id} draggableId={student._id} index={index}>
                                            {(provided) => (
                                                <StudentCard
                                                    provided={provided}
                                                    student={student}
                                                />
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* Assigned Students */}
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-2">
                            {selectedQuiz ? `Assigning to: ${selectedQuiz.title}` : 'Select a Quiz'}
                        </h2>
                        <Droppable droppableId="assigned" isDropDisabled={!selectedQuiz}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[400px] p-4 border rounded ${selectedQuiz ? 'border-green-400' : 'border-gray-300'} bg-gray-50`}
                                >
                                    {assignedStudents.length > 0 ? (
                                        assignedStudents.map((student, index) => (
                                            <Draggable key={student._id} draggableId={student._id} index={index}>
                                                {(provided) => (
                                                    <StudentCard
                                                        provided={provided}
                                                        student={student}
                                                    />
                                                )}
                                            </Draggable>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center mt-16">
                                            {selectedQuiz ? 'Drag students here' : 'Please select a quiz first'}
                                        </p>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

// Reusable StudentCard component
function StudentCard({ provided, student }) {
    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="relative p-3 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow mb-2"
        >
            <img
                src={student.profile_img || '/default-profile.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{student.username}</span>
        </div>
    );
}
