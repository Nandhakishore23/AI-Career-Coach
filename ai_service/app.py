from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "AI Service Running"})

@app.route('/generate-question', methods=['POST'])
def generate_question():
    data = request.json
    # TODO: Integrate LLM
    return jsonify({"question": "Tell me about a challenging project you worked on."})

@app.route('/analyze-response', methods=['POST'])
def analyze_response():
    data = request.json
    # TODO: Integrate Analysis
    return jsonify({"feedback": "Good use of STAR method, but try to be more concise."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
