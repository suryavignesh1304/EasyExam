from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import PyPDF2
import json
import re
import os
from fpdf import FPDF

app = Flask(__name__, static_folder='dist')
CORS(app)



# Convert PDF content to text
def pdf_to_text(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    return "".join(page.extract_text() for page in pdf_reader.pages)

# Parse MCQ text from extracted PDF text
def parse_mcq_text(text):
    mcq_list = []
    lines = text.strip().split('\n')
    current_question = None
    options = []
    correct_answer = None

    for line in lines:
        line = line.strip()

        if question_match := re.match(r'^\d+\.\s*(.+)', line):
            if current_question and options:
                mcq_list.append({
                    "question": current_question,
                    "options": options,
                    "correct_answer": correct_answer
                })
            current_question = question_match[1].strip()
            options = []
            correct_answer = None
        elif line.startswith(('(A)', '(B)', '(C)', '(D)')):
            option = line[3:].strip()
            options.append(option)
        elif line.startswith('**Answer:**'):
            if answer_match := re.search(r'\*\*Answer:\*\* (.+)', line):
                correct_answer = answer_match[1].strip()

    if current_question and options:
        mcq_list.append({
            "question": current_question,
            "options": options,
            "correct_answer": correct_answer
        })

    return mcq_list
PREDEFINED_EXAMS = [
    {
        "id": "exam1",
        "title": "General Knowledge Exam 1",
        "description": "A basic general knowledge exam covering various topics."
    },
    {
        "id": "exam2",
        "title": "Science Quiz",
        "description": "Test your knowledge of basic scientific concepts."
    },
    {
        "id": "exam3",
        "title": "History Challenge",
        "description": "Explore historical events and figures in this quiz."
    }
]

def create_pdf_from_text(text, output_filename):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)
    pdf.output(output_filename)

@app.route('/predefined-exams', methods=['GET'])
def get_predefined_exams():
    return jsonify(PREDEFINED_EXAMS)

@app.route('/predefined-exam/<exam_id>', methods=['GET'])
def get_predefined_exam(exam_id):
    exam_file = f'predefined_exams/{exam_id}.json'
    try:
        with open(exam_file, 'r') as json_file:
            exam_data = json.load(json_file)
        return jsonify(exam_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Exam not found'}), 404

@app.route('/convert-pdf', methods=['POST'])
def convert_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not file or not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type'}), 400
    try:
        text = pdf_to_text(file)
        mcq_list = parse_mcq_text(text)
        
        formatted_text = ""
        for i, mcq in enumerate(mcq_list, 1):
            formatted_text += f"{i}. {mcq['question']}\n"
            for option in mcq['options']:
                formatted_text += f"({option['label']}) {option['text']}\n"
            formatted_text += f"**Answer:** {mcq['correct_answer']}\n\n"
        
        output_filename = 'converted_exam.pdf'
        create_pdf_from_text(formatted_text, output_filename)
        
        return jsonify({"message": "PDF converted successfully", "filename": output_filename}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/text-to-pdf', methods=['POST'])
def text_to_pdf():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    try:
        output_filename = 'generated_exam.pdf'
        create_pdf_from_text(data['text'], output_filename)
        return jsonify({"message": "PDF created successfully", "filename": output_filename}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Endpoint to handle PDF uploads and parse MCQs
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not file or not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type'}), 400
    try:
        text = pdf_to_text(file)
        mcq_list = parse_mcq_text(text)

        questions = []
        answers = {}
        for index, mcq in enumerate(mcq_list):
            questions.append({
                "id": index,
                "question": mcq["question"],
                "options": mcq["options"]
            })
            answers[index] = mcq["correct_answer"]

        exam_json = {
            "title": "Generated Exam",
            "questions": questions
        }

        with open('exam_data.json', 'w') as json_file:
            json.dump(exam_json, json_file, indent=2)

        with open('exam_answers.json', 'w') as json_file:
            json.dump(answers, json_file, indent=2)

        return jsonify({"message": "Exam data generated successfully"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to retrieve the exam data
@app.route('/exam', methods=['GET'])
def get_exam():
    try:
        with open('exam_data.json', 'r') as json_file:
            exam_data = json.load(json_file)
        return jsonify(exam_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Exam data not found'}), 404

# Endpoint to submit answers and calculate score
@app.route('/submit', methods=['POST'])
def submit_exam():
    user_answers = request.json
    try:
        with open('exam_answers.json', 'r') as json_file:
            correct_answers = json.load(json_file)
    except FileNotFoundError:
        return jsonify({'error': 'Answer key not found'}), 404

    results = []
    score = 0
    total = len(correct_answers)

    for question_id, user_answer in user_answers.items():
        correct_answer = correct_answers.get(str(question_id))
        is_correct = user_answer == correct_answer
        if is_correct:
            score += 1

        results.append({
            'question_id': int(question_id),
            'user_answer': user_answer,
            'correct_answer': correct_answer,
            'is_correct': is_correct
        })

    percentage = (score / total) * 100 if total > 0 else 0

    return jsonify({
        'score': score,
        'total': total,
        'percentage': percentage,
        'results': results
    })

# Endpoint to save user answers
@app.route('/save-answers', methods=['POST'])
def save_answers():
    try:
        user_answers = request.json
        with open('user_answers.json', 'w') as json_file:
            json.dump(user_answers, json_file, indent=2)
        return jsonify({'message': 'Answers saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve React frontend
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Serve any other static file (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
