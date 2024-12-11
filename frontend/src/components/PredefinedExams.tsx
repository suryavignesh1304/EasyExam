import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Exam {
  title: string;
  questions: Question[];
  answers?: Record<string, string>;
}

const PredefinedExams: React.FC = () => {
  const [examId, setExamId] = useState<number | null>(null);
  const [examData, setExamData] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExam = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for testing
      const mockData: Record<number, Exam> = {
        0: {
          title: "Basic Python Quiz",
          questions: [
            { id: 0, question: "What is Python?", options: ["Programming language", "Snake", "Car"] },
            { id: 1, question: "What is PEP?", options: ["Python Enhancement Proposal", "Pepper", "None"] },
          ],
        },
        1: {
          title: "Basic Flask Quiz",
          questions: [
            { id: 0, question: "What is Flask?", options: ["Web framework", "Beverage", "Container"] },
          ],
        },
        2: {
          title: "Advanced Python Quiz",
          questions: [
            { id: 0, question: "What is a metaclass?", options: ["Class of a class", "Superclass", "Subclass"] },
          ],
        },
      };
  
      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (mockData[id]) {
        setExamData(mockData[id]);
      } else {
        throw new Error("Exam not found");
      }
    } catch (err) {
      console.error("Error fetching exam data:", err);
      setError("Failed to fetch exam data.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (examId !== null) {
      fetchExam(examId);
    }
  }, [examId]);

  const handleExamSelect = (id: number) => {
    setExamId(id);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Predefined Exams</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="examId">Select Exam ID:</label>
        <select
          id="examId"
          onChange={(e) => handleExamSelect(Number(e.target.value))}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="" disabled selected>Select an exam</option>
          <option value="0">Basic Python Quiz</option>
          <option value="1">Basic Flask Quiz</option>
          <option value="2">Advanced Python Quiz</option>
        </select>
      </div>

      {loading && <p>Loading exam data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {examData && (
        <div>
          <h2>{examData.title}</h2>
          {examData.questions.map((question) => (
            <div key={question.id} style={{ marginBottom: '15px' }}>
              <p><strong>Q{question.id + 1}:</strong> {question.question}</p>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredefinedExams;
