import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000';

interface ExamData {
  title: string;
  questions: {
    id: number;
    question: string;
    options: string[];
  }[];
}

interface SubmitResponse {
  score: number;
  total: number;
  percentage: number;
  results: {
    question_id: number;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }[];
}

export const uploadPDF = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response: AxiosResponse<{ message: string }> = await axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getExam = async (): Promise<ExamData> => {
  const response: AxiosResponse<ExamData> = await axios.get(`${API_URL}/exam`);
  return response.data;
};

export const submitExam = async (answers: Record<string, string>): Promise<SubmitResponse> => {
  const response: AxiosResponse<SubmitResponse> = await axios.post(`${API_URL}/submit`, answers);
  return response.data;
};

export const saveAnswers = async (answers: Record<string, string>): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await axios.post(`${API_URL}/save-answers`, answers);
  return response.data;
};