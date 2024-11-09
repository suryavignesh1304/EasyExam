import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Book, ChevronRight, Loader } from 'lucide-react';

interface PredefinedExam {
    id: string;
    title: string;
    description: string;
}

const PredefinedExams: React.FC = () => {
    const [exams, setExams] = useState<PredefinedExam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('https://exameasy.up.railway.app//predefined-exams');
                setExams(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching predefined exams:', err);
                setError('Failed to load predefined exams. Please try again later.');
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const handleExamClick = (examId: string) => {
        navigate(`/exam/${examId}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 text-xl mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-3xl font-bold text-center text-blue-600 mb-8"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Predefined Exams
            </motion.h1>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {exams.map((exam) => (
                    <motion.div
                        key={exam.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                        onClick={() => handleExamClick(exam.id)}
                        variants={itemVariants}
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Book className="h-6 w-6 text-blue-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">{exam.title}</h2>
                            </div>
                            <p className="text-gray-600 mb-4">{exam.description}</p>
                            <div className="flex items-center text-blue-500 font-semibold">
                                Start Exam
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            {exams.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No predefined exams available at the moment.</p>
            )}
            <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                    <ChevronRight className="mr-2 h-5 w-5 transform rotate-180" />
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
};

export default PredefinedExams;