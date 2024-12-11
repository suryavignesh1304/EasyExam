import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import ExamSetup from './components/ExamSetup';
import Exam from './components/Exam';
import AnswerInput from './components/AnswerInput';
import HomePage from './components/HomePage';
import PdfInstructions from './components/PdfInstructions';
import PredefinedExams from './components/PredefinedExams';
import TextToPdf from './components/TextToPdf';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center max-sm:">CBT Exam System</h1>
        <Routes>
        <Route path="/" element={< HomePage/>} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/answer-input" element={<AnswerInput />} />
          <Route path="/exam-setup" element={<ExamSetup />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/pdf-instructions" element={<PdfInstructions />} />
          <Route path="/predefined-exams" element={<PredefinedExams />} />
          <Route path="/text-to-pdf" element={<TextToPdf />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;