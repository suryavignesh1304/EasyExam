from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import PyPDF2
import json
import re
import os
from fpdf import FPDF

app = Flask(__name__, static_folder='dist')
CORS(app)

# Predefined exam data
predefined_exams = [
    {
        "title": "Biology Basics",
        "questions": [
            {
                "id": 1,
                "question": "What is needed as a source of energy for vital activities of the body?",
                "options": ["Carbohydrates", "Proteins", "Fats", "Iron"],
                "correct_answer": "A"
            },
            {
                "id": 2,
                "question": "Hemoglobin (Hb) is a protein that is found in the _____ of the blood.",
                "options": ["Plasma", "Red blood cells", "Platelets", "White blood cells"],
                "correct_answer": "B"
            },
            {
                "id": 3,
                "question": "What is essential for the formation of hemoglobin?",
                "options": ["Iron", "Calcium", "Vitamin C", "Magnesium"],
                "correct_answer": "A"
            },
            {
                "id": 4,
                "question": "What is considered a good source of iodine?",
                "options": ["Fruits", "Sea foods", "Grains", "Vegetables"],
                "correct_answer": "B"
            }
        ]
    }
]

# Convert PDF content to text
def pdf_to_text(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    return "".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())

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

# Endpoint to retrieve predefined exams
@app.route('/predefined-exams', methods=['GET'])
def get_predefined_exams():
    return jsonify(predefined_exams)

# Endpoint to convert user text to PDF
@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.json.get('text')
    if not data:
        return jsonify({"error": "No text provided"}), 400

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, data)
    pdf_output_path = 'generated_output.pdf'
    pdf.output(pdf_output_path)

    return send_file(pdf_output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
