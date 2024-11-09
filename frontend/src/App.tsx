import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import all components
import HomePage from './components/HomePage';
import FileUpload from './components/FileUpload';
import ExamSetup from './components/ExamSetup';
import Exam from './components/Exam';
import AnswerInput from './components/AnswerInput';
import PdfConverter from './components/PdfConverter';
import TextToPdf from './components/TextToPdf';
import PdfInstructions from './components/PdfInstructions';
import PredefinedExams from './components/PredefinedExams';

const App: React.FC = () => {
  const pageVariants = {
    initial: { opacity: 0, x: '-100vw' },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: '100vw' }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <AnimatePresence>
          <Routes>
            <Route path="/" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            } />
            <Route path="/upload" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <FileUpload />
              </motion.div>
            } />
            <Route path="/exam-setup" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ExamSetup />
              </motion.div>
            } />
            <Route path="/exam/:examId" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Exam />
              </motion.div>
            } />
            <Route path="/answer-input" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AnswerInput />
              </motion.div>
            } />
            <Route path="/pdf-converter" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PdfConverter />
              </motion.div>
            } />
            <Route path="/text-to-pdf" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TextToPdf />
              </motion.div>
            } />
            <Route path="/pdf-instructions" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PdfInstructions />
              </motion.div>
            } />
            <Route path="/predefined-exams" element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PredefinedExams />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;