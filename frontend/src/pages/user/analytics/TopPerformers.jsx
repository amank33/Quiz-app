import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";

export default function TopPerformers() {
    const [topPerformers, setTopPerformers] = useState([]);

    useEffect(() => {
        async function fetchTopPerformers() {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await axios.get(`${baseUrl}/api/analytics/top-performers`);
                console.log(response.data, 'Top Performers Data');
                setTopPerformers(response.data);
            } catch (error) {
                console.error('Error fetching top performers:', error);
            }
        }

        fetchTopPerformers();
    }, []);

    return (
        <motion.div className="container" style={{ margin: '0 auto', padding: '0.75rem' }}
        // initial="hidden"
        //         whileInView="visible"
        //         viewport={{ once: true, amount: 0.5 }}
        initial='hidden'
          animate="visible"
                transition={{ duration: 1 }}
                variants={{
                  hidden: { opacity: 0, x: -100 },
                  visible: { opacity: 1, x: 0 },
                }}
        >
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#4B5563' }}>Leaderboards</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {topPerformers.map((performer, index) => (
                    <div
                        key={index}
                        style={{ background: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s', transform: 'scale(1)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div className="text-2xl font-bold text-gray-800 mb-2">#{index + 1}</div>
                        <img
                            src={performer.profile_img}
                            alt={`${performer.username}'s profile`}
                            style={{ width: '4rem', height: '4rem', borderRadius: '50%', marginTop: '0.5rem', marginBottom: '0.5rem', border: '2px solid #D1D5DB' }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: '#1F2937' }}>{performer.username}</span>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: '#6B7280' }}>Average Score: {performer.averageScore.toFixed(2)}</span>
                            {/* <span style={{ display: 'block', fontSize: '0.875rem', color: '#6B7280' }}>Average Score: {performer.averageScore}</span> */}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}