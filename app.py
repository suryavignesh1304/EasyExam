from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import PyPDF2
import json
import re
import os
from fpdf import FPDF
app = Flask(__name__, static_folder='dist')
CORS(app)

# Create structured folders
UPLOAD_FOLDER = 'upload'
QUESTIONS_FOLDER = os.path.join(UPLOAD_FOLDER, 'generated_questions')
ANSWERS_FOLDER = os.path.join(UPLOAD_FOLDER, 'generated_answers')
PREDEFINED_FOLDER = os.path.join(UPLOAD_FOLDER, 'predefined_exams')

os.makedirs(QUESTIONS_FOLDER, exist_ok=True)
os.makedirs(ANSWERS_FOLDER, exist_ok=True)
os.makedirs(PREDEFINED_FOLDER, exist_ok=True)

# Load predefined exams (Create predefined exam files)
def initialize_predefined_exams():
    predefined_exams = [
        {
            "title": "Basic Python Quiz",
            "questions": [
                {"id": 0, "question": "What is Python?", "options": ["A programming language", "A snake", "A framework", "None of the above"]},
                {"id": 1, "question": "Which keyword is used for functions?", "options": ["def", "function", "lambda", "func"]},
            ],
            "answers": {"0": "A programming language", "1": "def"}
        },
        {
            "title": "Basic Flask Quiz",
            "questions": [
                {"id": 0, "question": "What is Flask?", "options": ["A web framework", "A library", "A database", "An IDE"]},
                {"id": 1, "question": "Flask is written in?", "options": ["Python", "Java", "C++", "PHP"]},
            ],
            "answers": {"0": "A web framework", "1": "Python"}
        },
        {
            "title": "Advanced Python Quiz",
            "questions": [
                {"id": 0, "question": "What does the 'yield' keyword do?", "options": ["Create a generator", "Return a value", "Exit a function", "None of the above"]},
                {"id": 1, "question": "What is a decorator?", "options": ["A function wrapper", "An iterator", "A loop construct", "A data type"]},
            ],
            "answers": {"0": "Create a generator", "1": "A function wrapper"}
        }
    ]
    for index, exam in enumerate(predefined_exams):
        with open(os.path.join(PREDEFINED_FOLDER, f'predefined_exam_{index}.json'), 'w') as json_file:
            json.dump(exam, json_file, indent=2)

initialize_predefined_exams()

# Convert PDF content to text
def pdf_to_text(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

# Parse MCQ text from extracted PDF text
def parse_mcq_text(text):
    mcq_list = []
    lines = text.strip().split('\n')
    current_question = None
    options = []
    correct_answer = None

    for line in lines:
        line = line.strip()
        
        # Match question format like "1. What is Python?"
        question_match = re.match(r'^\d+\.\s*(.+)', line)
        if question_match:
            if current_question and options:
                mcq_list.append({
                    "question": current_question,
                    "options": options,
                    "correct_answer": correct_answer
                })
            current_question = question_match.group(1).strip()
            options = []
            correct_answer = None
        elif line.startswith(('(A)', '(B)', '(C)', '(D)')):
            option = line[3:].strip()
            options.append(option)
        elif line.startswith('**Answer:**'):
            answer_match = re.search(r'\*\*Answer:\*\* (.+)', line)
            if answer_match:
                correct_answer = answer_match.group(1).strip()

    if current_question and options:
        mcq_list.append({
            "question": current_question,
            "options": options,
            "correct_answer": correct_answer
        })

    return mcq_list

# Endpoint to handle PDF uploads and parse MCQs
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.endswith('.pdf'):
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

            # Save files in structured folders
            questions_path = os.path.join(QUESTIONS_FOLDER, 'generated_exam.json')
            answers_path = os.path.join(ANSWERS_FOLDER, 'generated_answers.json')

            with open(questions_path, 'w') as json_file:
                json.dump(exam_json, json_file, indent=2)

            with open(answers_path, 'w') as json_file:
                json.dump(answers, json_file, indent=2)

            return jsonify({"message": "Exam data generated successfully"}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# Endpoint to retrieve predefined exams
@app.route('/predefined/<int:exam_id>', methods=['GET'])
def get_predefined_exam(exam_id):
    try:
        exam_file = os.path.join(PREDEFINED_FOLDER, f'predefined_exam_{exam_id}.json')
        with open(exam_file, 'r') as json_file:
            exam_data = json.load(json_file)
        return jsonify(exam_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Predefined exam not found'}), 404


# Route to convert text to PDF
@app.route('/text-to-pdf', methods=['POST'])
def convert_text_to_pdf():
    try:
        data = request.json
        text = data.get('text', '')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        lines = text.split('\n')
        for line in lines:
            pdf.cell(200, 10, txt=line, ln=True)
        
        pdf_path = os.path.join(UPLOAD_FOLDER, 'converted_text.pdf')
        pdf.output(pdf_path)
        
        # Send the PDF file as a response to download
        return send_file(pdf_path, as_attachment=True, attachment_filename='converted_text.pdf')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint to retrieve the exam data
@app.route('/exam', methods=['GET'])
def get_exam():
    try:
        with open(os.path.join(QUESTIONS_FOLDER, 'generated_exam.json'), 'r') as json_file:
            exam_data = json.load(json_file)
        return jsonify(exam_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Exam data not found'}), 404

# Endpoint to submit answers and calculate score
@app.route('/submit', methods=['POST'])
def submit_exam():
    user_answers = request.json
    try:
        with open(os.path.join(ANSWERS_FOLDER, 'generated_answers.json'), 'r') as json_file:
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

# Serve React frontend
@app.route('/')
def serve_homepage():
    return send_from_directory(app.static_folder, 'index.html')

# Serve any other static file (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
