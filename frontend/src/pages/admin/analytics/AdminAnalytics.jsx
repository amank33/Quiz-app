import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {motion} from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import TopPerformers from '../../user/analytics/TopPerformers';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function Adminanalytics() {
    const [examData, setExamData] = useState({
        examsCreated: [],
        examAttemptsOverTime: [],
        averageScorePerExam: [],
        topExamsByAttempts: [],
        overallUserPerformance: [],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await axios.get(`${baseUrl}/api/analytics/admin`);
                //debugger;
                const data = response.data;
                console.log(data, 'admin analytics data');

                setExamData({
                    examsCreated: data.examsCreated,
                    examAttemptsOverTime: data.examAttemptsOverTime,
                    averageScorePerExam: data.averageScorePerExam,
                    topExamsByAttempts: data.topExamsByAttempts,
                    overallUserPerformance: data.overallUserPerformance,
                });
            } catch (error) {
                console.error('Error fetching admin analytics data:', error);
            }
        }

        fetchData();
    }, []);

    const overallUserPerformanceData = {
        labels: examData.overallUserPerformance.map(user => user.username),
        datasets: [
          {
            label: 'Correct Answers',
            data: examData.overallUserPerformance.map(user => user.correct),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Incorrect Answers',
            data: examData.overallUserPerformance.map(user => user.incorrect),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },
        ],
      };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Leaderboard */}
                <motion.div className="bg-white shadow-md rounded-lg p-3 md:col-span-2 lg:col-span-3"
                // className='rounded-lg bg-white p-3 shadow-md md:col-span-2 lg:col-span-3'
                initial='hidden'
                animate='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: -100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <TopPerformers />
                </motion.div>

                 {/* Exams Created per admin */}
                <motion.div className="bg-white shadow-md rounded-lg p-3"
                initial='hidden'
                animate='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Exams Created - AdminWise</h2>
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.3 }}
                    variants={{
                      hidden: { opacity: 0, x: 100 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    >
                        {examData.examsCreated.map((admin, index) => (
                            <div key={index} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-sm">
                                <img
                                    src={admin.adminProfileImg}
                                    alt={`${admin.adminName}'s profile`}
                                    className="w-12 h-12 rounded-full mr-4 border border-gray-300"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{admin.adminName}</h3>
                                    <p className="text-sm text-gray-500">Exams Created: <span className="font-semibold text-gray-700">{admin.totalExams}</span></p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Overall User Performance */}
                <motion.div className="bg-white shadow-md rounded-lg p-3"
                initial='hidden'
                animate='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Overall User Performance</h2>
                    <Bar
                        data={overallUserPerformanceData}
                    />
                </motion.div> 

                

                {/* Average Score Per Exam */}
                <motion.div className="bg-white shadow-md rounded-lg p-3"
                initial='hidden'
                animate='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: -100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Average Score Per Exam</h2>
                    <Bar
                        data={{
                            labels: examData.averageScorePerExam.map(item => item.examName),
                            datasets: [
                                {
                                    label: 'Average Score',
                                    data: examData.averageScorePerExam.map(item => item.averageScore),
                                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                },
                            ],
                        }}
                    />
                </motion.div>

                {/* Top Exams by Attempts */}
                <motion.div className="bg-white shadow-md rounded-lg p-3"
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Exams by Attempts</h2>
                    <Bar
                        data={{
                            labels: examData.topExamsByAttempts.map(item => item.examName),
                            datasets: [
                                {
                                    label: 'Attempts',
                                    data: examData.topExamsByAttempts.map(item => item.attempts),
                                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                                },
                            ],
                        }}
                    />
                </motion.div>

                
                {/* Exam Attempts Over Time */}
                <motion.div className="bg-white shadow-md rounded-lg p-3"
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: -100 },
                  visible: { opacity: 1, x: 0 },
                }}
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Exam Attempts Over Time</h2>
                    <Line
                        data={{
                            labels: examData.examAttemptsOverTime.map(item => item._id),
                            datasets: [
                                {
                                    label: 'Attempts',
                                    data: examData.examAttemptsOverTime.map(item => item.attempts),
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    fill: false,
                                },
                            ],
                        }}
                    />
                </motion.div>

            </div>
        </div>
    );
}