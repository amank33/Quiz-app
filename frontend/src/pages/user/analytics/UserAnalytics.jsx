import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
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
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
//   } from 'recharts';
import './UserAnalytics.css';
import TopPerformers from './TopPerformers';
import { motion } from 'framer-motion';

// Register required components
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

export default function UserAnalytics() {
  const [scoreData, setScoreData] = useState([]);
  const [examTimeData, setExamTimeData] = useState([]);
  const [correctIncorrectData, setCorrectIncorrectData] = useState({});
  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [totalExamsOverTime, setTotalExamsOverTime] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        let userInSession = JSON.parse(sessionStorage.getItem('user'))?.user;
        console.log(userInSession, 'userInSession');
        const response = await axios.get(`${baseUrl}/api/analytics/user/${userInSession._id}`);
        const data = response.data;
        console.log(data, 'Analytics Data');

        setScoreData(data.scorePerExam);
        setExamTimeData(data.timeTakenPerExam);
        setCorrectIncorrectData(data.correctIncorrectRatio);
        setPerformanceTrend(data.performanceTrend);
        setTotalExamsOverTime(data.totalExamsGivenOverTime);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    }

    fetchData();
  }, []);

  const groupedData = scoreData.reduce((acc, item) => {
    if (!acc[item.examId]) {
      acc[item.examId] = { examName: item.examName, scores: [] };
    }
    acc[item.examId].scores.push(item.score);
    return acc;
  }, {});
  console.log(groupedData, 'groupedData');

  const scorePerExamlabels = [];
  const scorePerExamdata = [];
  let scorePerExamDataLegendBG = [];
  const scorePerExamDataLabelBG = [];

  Object.entries(groupedData).forEach(([examId, { examName, scores }]) => {
    let bg = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
    scores.forEach((score, index) => {
      //scorePerExamlabels.push(`${examName} - ${index + 1}`);
      scorePerExamlabels.push(`Try-${index + 1}`);
      scorePerExamdata.push(score);
      scorePerExamDataLabelBG.push(bg);
      scorePerExamDataLegendBG.push({
        backgroundColor: bg,
        label: `${examName}`,
      });
    });
  });

  console.log(scorePerExamdata, 'scorePerExamdata');
  scorePerExamDataLegendBG = scorePerExamDataLegendBG.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.label === item.label && t.backgroundColor === item.backgroundColor)
  );
  console.log(scorePerExamDataLegendBG, 'scorePerExamDataLabelBG');

  const datasets = Object.keys(groupedData).map((examId) => ({
    label: groupedData[examId].examName,
    data: groupedData[examId].scores,
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
  }));
  //console.log(datasets, 'datasets');

  // const datasets2 = Object.keys(groupedData).map((examId) => ({
  //     label: groupedData[examId].examName,
  //     data: groupedData[examId].scores,
  //     backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
  // }));
  // // console.log(datasets2, 'datasets2');

  const maxLengthExamId = Object.keys(groupedData).reduce(
    (maxId, examId) =>
      groupedData[examId].scores.length > (groupedData[maxId]?.scores.length || 0) ? examId : maxId,
    null
  );

  const labels = maxLengthExamId
    ? groupedData[maxLengthExamId].scores.map((_, idx) => `Attempt ${idx + 1}`)
    : [];
  //console.log(labels, 'labels');

  // const labels2 = datasets2.map((dataset) => dataset.data.map((_, idx) => `Attempt ${idx + 1}`)).flat();
  //console.log(labels2, 'labels2');

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">User Analytics</h1> */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <motion.div
          className='rounded-lg bg-white p-3 shadow-md md:col-span-2 lg:col-span-3'
          initial='hidden'
          animate="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <TopPerformers />
        </motion.div>
        <motion.div
          className='rounded-lg bg-white p-3 shadow-md'
          style={{ maxWidth: '300px', margin: '0 auto' }}
          initial='hidden'
          animate="visible"
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Correct vs Incorrect Ratio</h2>
          <Pie
            data={{
              labels: ['Correct', 'Incorrect'],
              datasets: [
                {
                  data: [correctIncorrectData.correct, correctIncorrectData.incorrect],
                  backgroundColor: ['#36A2EB', '#FF6384'],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 10, // Reduced font size
                    },
                  },
                },
              },
              maintainAspectRatio: true, // Maintain proportions for height and width
            }}
            style={{ maxWidth: '200px', maxHeight: '200px', margin: '0 auto' }} // Further reduced size while maintaining proportions
          />
        </motion.div>

        {/* Scores per exam */}
        <motion.div
          className='rounded-lg bg-white p-3 shadow-md'
          initial='hidden'
          animate="visible"
          // whileInView='visible'
          // viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Scores per Exam (Score-wise)</h2>
          <Bar
            data={{
              labels,
              datasets,
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Scores per Exam',
                },
              },
              scales: {
                x: {
                  stacked: false,
                  barThickness: 20, // Reduce the width of the bars
                },
                y: {
                  stacked: false,
                },
              },
            }}
          />
        </motion.div>

        {/* Scores per exam 2 */}
        <motion.div
          className='rounded-lg bg-white p-3 shadow-md'
          id='scores-per-exam-2'
          initial='hidden'
          animate="visible"
          // viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Scores per Exam (Exam-wise)</h2>
          <Bar
            data={{
              labels: scorePerExamlabels, // Extracting ateempt names only
              datasets: [
                {
                  label: 'Score per Attempt',
                  data: scorePerExamdata,
                  // backgroundColor: scorePerExamdata.map(() =>
                  //   `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
                  // ),
                  backgroundColor: scorePerExamDataLabelBG,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    // generateLabels: function (chart) {
                    //     const datasets = chart.data.datasets[0]; // Assuming single dataset for simplicity
                    //     const uniqueColors = new Map();

                    //     chart.data.labels.forEach((label, index) => {
                    //         const color = datasets.backgroundColor[index];
                    //         if (!uniqueColors.has(color)) {
                    //             uniqueColors.set(color, label);
                    //         }
                    //     });

                    //     return Array.from(uniqueColors.entries()).map(([color, label]) => ({
                    //         text: label.split(' - ')[0], // Display only the exam name
                    //         fillStyle: color,
                    //     }));
                    // },
                    generateLabels: function (chart) {
                      return Array.from(new Set(scorePerExamDataLegendBG)).map((label, index) => ({
                        text: label.label, // Display only the exam name
                        fillStyle: label.backgroundColor,
                      }));
                    },
                  },
                },
                title: {
                  display: true,
                  text: 'Scores per Exam Attempt',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Score: ${context.raw}`;
                    },
                  },
                },
              },
              scales: {
                x: { stacked: false },
                y: { beginAtZero: true },
              },
            }}
          />
        </motion.div>

        {/* Time taken per exam */}
        <motion.div
          className='rounded-lg bg-white p-3 shadow-md'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Time Taken per Exam</h2>
          <Bar
            data={{
              labels: examTimeData.map((item) => item.examName),
              datasets: [
                {
                  label: 'Time Taken (seconds)',
                  data: examTimeData.map((item) => item.timeTakenSeconds),
                  //backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  backgroundColor: [
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function (context) {
                      const index = context.dataIndex;
                      const exam = examTimeData[index];
                      return [
                        `Exam: ${exam.examName}`,
                        `Time taken: ${exam.time}`,
                        `Duration: 0${exam.duration}:00`,
                        `Time Taken(s): ${exam.timeTakenSeconds} seconds`,
                        `Date: ${exam.date}`,
                      ];
                    },
                  },
                },
                legend: {
                  display: true,
                  position: 'bottom',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </motion.div>

        {/* Total Exams Given Over Time */}
        <motion.div
          className='rounded-lg bg-white p-2 shadow-md'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Total Exams Given Over Time</h2>
          <Line
            data={{
              labels: totalExamsOverTime.map((item) => item.date),
              datasets: [
                {
                  label: 'Total Exams',
                  data: totalExamsOverTime.map((item) => item.count),
                  borderColor: 'rgba(75, 192, 192, 1)',
                  fill: false,
                },
              ],
            }}
          />
        </motion.div>

        <motion.div
          className='rounded-lg bg-white p-2 shadow-md md:col-span-2 lg:col-span-3'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          variants={{
            hidden: { opacity: 0, x: -100 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Performance Trend</h2>
          <Line
            data={{
              //labels: performanceTrend.map((_, index) => `Exam ${index + 1}`),
              labels: performanceTrend.map(
                (item, index) => `${item.examId.title.toUpperCase()} (${index + 1})`
              ),
              datasets: [
                {
                  label: 'Score',
                  data: performanceTrend.map((item) => item.score),
                  borderColor: 'rgba(255, 159, 64, 1)',
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function (context) {
                      const index = context.dataIndex;
                      const submission = performanceTrend[index];
                      return [
                        `Exam: ${submission.examId.title}`,
                        `Score: ${submission.score}`,
                        //`Duration: 0${exam.duration}:00`,
                        // `Time Taken(s): ${exam.timeTakenSeconds} seconds`,
                        `Date: ${submission.createdAt.split('T')[0]}`,
                      ];
                    },
                  },
                },
                legend: {
                  display: true,
                  position: 'bottom',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
