import React from 'react';
import { motion } from 'framer-motion';

const PdfInstructions: React.FC = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
            initial="initial"
            animate="animate"
            variants={fadeIn}
        >
            <h2 className="text-3xl font-bold mb-6 text-blue-600">PDF Structure Instructions</h2>
            <div className="space-y-6">
                <p className="text-lg text-gray-700">
                    To ensure your PDF is correctly parsed by our system, please follow these guidelines:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                    <li>Each question should start with a number followed by a period and a space.</li>
                    <li>Options should be labeled (A), (B), (C), (D) and appear on separate lines.</li>
                    <li>The correct answer should be indicated by "**Answer:**" followed by the letter of the correct option.</li>
                    <li>Leave a blank line between questions for better readability.</li>
                </ol>
                <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-600">Example Format:</h3>
                <pre className="bg-gray-100 p-6 rounded-lg whitespace-pre-wrap text-sm font-mono">
                    {`1. What is the capital of France?
(A) London
(B) Berlin
(C) Paris
(D) Madrid
**Answer:** C

2. Which planet is known as the Red Planet?
(A) Venus
(B) Mars
(C) Jupiter
(D) Saturn
**Answer:** B`}
                </pre>
                <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-yellow-700">
                        <strong>Note:</strong> Ensuring your PDF follows this format will greatly improve the accuracy of our parsing system and the quality of the generated CBT.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default PdfInstructions;