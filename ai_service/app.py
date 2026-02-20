import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import json
import base64
import io
from pypdf import PdfReader

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use a stable model
model = genai.GenerativeModel('gemini-2.5-flash')

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "AI Service Running with Gemini 1.5 Flash"})

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    try:
        user_data = request.json
        print("Received generation request:", user_data)
        
        weekly_hours = user_data.get('weeklyHours', 10)
        target_company = user_data.get('targetCompany', 'Tech Company')
        known_skills_str = ', '.join(user_data.get('currentSkills', []))
        
        # Construct Prompt
        prompt = f"""
        Act as an expert Technical Career Coach. Create a personalized learning roadmap in JSON format.
        
        USER PROFILE:
        - Goal: {user_data.get('careerGoal')}
        - Level: {user_data.get('experienceLevel')}
        - Target Company: {target_company}
        - Time Commitment: {weekly_hours} hours/week
        - Style: {user_data.get('learningStyle')}
        - Known Skills (SKIP THESE): {known_skills_str}
        
        REQUIREMENTS:
        1. Return ONLY valid JSON. No markdown formatting.
        2. The JSON must be an ARRAY of "PHASE" objects.
        3. Structure:
           [
             {{
               "title": "Week 1: [Focus Area]",
               "modules": [
                 {{
                   "title": "Day 1-2: [Topic Name]",
                   "topics": [
                   "topics": [
                     {{ "title": "Concept A", "difficulty": "Intermediate", "outcome": "What you will learn" }}
                   ]
                 }}
               ]
             }}
           ]
        3b. **DIFFICULTY LEVELS**:
           - You MUST strictly use one of these values for "difficulty": "Beginner", "Intermediate", "Advanced".
           - Do NOT use "Beginner-Intermediate" or hybrid terms.
        4. **CRITICAL - TIME AWARENESS**:
           - Use the user's Time Commitment ({weekly_hours} hours/week) to calculate the workload.
           - If strict time (e.g. 5h/week), suggest fewer topics per week.
           - If high time (e.g. 40h/week), suggest dense weeks.
           - Structure the "Phases" as WEEKS (e.g., "Week 1", "Week 2").
           - Structure the "Modules" as DAYS or intervals (e.g. "Day 1", "Day 2-3").
        
        5. **GAP ANALYSIS**:
           - Use "Known Skills" to FILTER the roadmap.
           - If user knows React, SKIP basics. Start from Advanced.
           - Focus entirely on what they LACK for {target_company}.
           
        6. **OUTPUT**:
           - Generate 4-6 Weeks (Phases).
           - Inside each Week, generate 3-5 Daily Modules depending on intensity.
        
        JSON OUTPUT:
        """
        
        response = model.generate_content(prompt)
        # Clean up code blocks if present
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        
        roadmap_json = json.loads(text_response)
        
        return jsonify({"roadmap": roadmap_json})
    
    except Exception as e:
        print("AI Error:", e)
        error_msg = str(e)
        if "429" in error_msg or "Quota exceeded" in error_msg:
             return jsonify({"error": error_msg}), 429
        return jsonify({"error": error_msg}), 500

@app.route('/generate-topic-content', methods=['POST'])
def generate_topic_content():
    try:
        data = request.json
        topic = data.get('topic')
        level = data.get('level', 'Intermediate')
        role = data.get('role', 'Developer')
        
        print(f"Generating content for: {topic} ({level})")
        
        prompt = f"""
        Act as a Senior {role} Mentor.
        Teach me "{topic}" for a {level} level student.
        
        Return JSON with:
        1. "explanation": (A clear, concise markdown explanation (max 300 words). Use analogies.)
        2. "key_concepts": (Array of 3-5 bullet points)
        3. "practice_task": (A specific mini-project or coding challenge description)
        4. "video_query": (Best YouTube search query for this topic)
        
        JSON OUTPUT:
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        content = json.loads(text_response)
        
        return jsonify(content)

    except Exception as e:
        print("Content Gen Error:", e)
        error_msg = str(e)
        if "429" in error_msg or "Quota exceeded" in error_msg:
             return jsonify({"error": error_msg}), 429
        return jsonify({"error": error_msg}), 500

@app.route('/recommend-career', methods=['POST'])
def recommend_career():
    try:
        data = request.json
        interests = data.get('interests')
        working_style = data.get('workingStyle')
        skills = data.get('skills', 'None')
        
        print(f"Recommending career for: {interests} ({working_style})")
        
        prompt = f"""
        Act as an expert Career Counselor.
        The user is deciding on a tech career path.
        
        USER PROFILE:
        - Interests/Hobbies: {interests}
        - Working Style: {working_style}
        - Current Skills: {skills}
        
        TASK:
        Analyze the profile and suggest top 3 Tech Roles that fit them best.
        
        JSON OUTPUT REQUIREMENTS:
        Return a JSON object with a key "recommendations" containing an array of 3 objects:
        [
          {{
            "role": "Job Title (e.g. Frontend Developer)",
            "matchPercentage": 95,
            "reason": "Why this fits their interests/style in 1 sentence.",
            "salaryRange": "$X-Y k",
            "learningCurve": "Easy/Medium/Hard"
          }}
        ]
        
        JSON OUTPUT:
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text_response)
        
        return jsonify(result)

    except Exception as e:
        print("Career Rec Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/interview/start', methods=['POST'])
def start_interview():
    try:
        data = request.json
        role = data.get('role', 'Frontend Developer')
        topic = data.get('topic', 'General')
        difficulty = data.get('difficulty', 'Intermediate')
        
        print(f"Starting Interview: {role} - {topic} ({difficulty})")
        
        if 'resume' in data and data['resume']:
            try:
                # Decode Base64 PDF
                pdf_data = base64.b64decode(data['resume'])
                pdf_file = io.BytesIO(pdf_data)
                reader = PdfReader(pdf_file)
                resume_text = ""
                for page in reader.pages:
                    resume_text += page.extract_text() + "\n"
                
                print(f"Extracted Resume Text ({len(resume_text)} chars)")
                
                # Contextual Prompt with Resume
                prompt = f"""
                Act as a Friendly {role} Interviewer.
                I have uploaded my resume.
                
                RESUME CONTENT:
                {resume_text[:3000]} # Limit characters to avoid token limits
                
                Start a technical interview about "{topic}".
                
                CRITICAL INSTRUCTION:
                - Read the Resume logic above.
                - Start with a question specifically related to a project or skill mentioned in the resume.
                - Example: "I see you used Redux in your e-commerce project. Can you explain how you handled async actions?"
                - If the resume is empty or unclear, fall back to a customary introductory question.
                
                Generate the FIRST question.
                
                JSON OUTPUT:
                {{
                    "question": "The actual question text",
                    "context": "I'm asking this because it's listed on your resume..."
                }}
                """
            except Exception as e:
                print("Resume Parsing Error:", e)
                # Fallback prompt if resume fails
                prompt = f"""
                Act as a Friendly {role} Interviewer.
                Start a technical interview about "{topic}".
                
                CRITICAL INSTRUCTION:
                - Start with a VERY CUSTOMARY, SIMPLE, INTRODUCTORY question.
                - Example: "What is React?"
                
                Generate the FIRST question.
                
                JSON OUTPUT:
                {{
                    "question": "The actual question text",
                    "context": "Brief context on why this is important (1 sentence)"
                }}
                """
        else:
             prompt = f"""
            Act as a Friendly {role} Interviewer.
            Start a technical interview about "{topic}".
            
            CRITICAL INSTRUCTION:
            - Start with a VERY CUSTOMARY, SIMPLE, INTRODUCTORY question.
            - Do not ask complex scenarios yet.
            - Example: "What is React?" or "Explain the difference between let and var."
            
            Generate the FIRST question.
            
            JSON OUTPUT:
            {{
                "question": "The actual question text",
                "context": "Brief context on why this is important (1 sentence)"
            }}
            """
        
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        
        # Robust JSON cleaning
        if text_response.startswith('```json'):
            text_response = text_response.split('```json')[1]
        if text_response.endswith('```'):
            text_response = text_response.split('```')[0]
        text_response = text_response.strip()

        try:
            result = json.loads(text_response)
            return jsonify(result)
        except json.JSONDecodeError as je:
            print(f"JSON Error in start_interview: {je}")
            print(f"Raw Response: {response.text}")
            return jsonify({"error": "Failed to parse AI response"}), 500
    
    except Exception as e:
        print("Interview Start Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/interview/analyze', methods=['POST'])
def analyze_interview():
    try:
        data = request.json
        current_question = data.get('question')
        user_answer = data.get('answer')
        role = data.get('role', 'Developer')
        
        print(f"Analyzing Answer for: {role}")
        
        prompt = f"""
        Act as a Senior {role} Interviewer.
        
        Question: "{current_question}"
        User Answer: "{user_answer}"
        
        TASK:
        1. Rate the answer (1-10).
        2. Provide feedback (Pros/Cons).
        3. Generate the NEXT question (follow-up or new topic).
        
        JSON OUTPUT:
        {{
            "score": 7,
            "feedback": "Good mention of X, but you missed Y.",
            "suggested_answer": "Better way to say it...",
            "next_question": " The next question text",
            "next_context": "Context for the next question"
        }}
        """
        
        response = model.generate_content(prompt)
        # Robust JSON cleaning
        text_response = response.text.strip()
        if text_response.startswith('```json'):
            text_response = text_response.split('```json')[1]
        if text_response.endswith('```'):
            text_response = text_response.split('```')[0]
        text_response = text_response.strip()
            
        result = json.loads(text_response)
        
        return jsonify(result)
        
    except json.JSONDecodeError as je:
        print(f"JSON Error: {je}")
        print(f"Raw Response: {response.text}")
        return jsonify({"error": "Failed to parse AI response"}), 500
        
    except Exception as e:
        print("Interview Analysis Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/interview/end', methods=['POST'])
def end_interview():
    try:
        data = request.json
        history = data.get('history', [])
        role = data.get('role', 'Developer')
        
        print(f"Generating Report for: {role} ({len(history)} interactions)")
        
        # Format history for the prompt
        history_text = ""
        for idx, item in enumerate(history):
            history_text += f"\nQ{idx+1}: {item.get('question')}\nUser Answer: {item.get('answer')}\nScore: {item.get('score')}\nAI Feedback: {item.get('feedback')}\n"
        
        prompt = f"""
        Act as a Hiring Manager for a {role} position.
        Review the following interview session history and provide a final performance report.
        
        INTERVIEW HISTORY:
        {history_text}
        
        TASK:
        1. Calculate an overall score (0-100).
        2. Identify top 3 strengths.
        3. Identify top 3 weaknesses.
        4. Suggest ONE key focus area to improve.
        
        JSON OUTPUT:
        {{
            "overall_score": 85,
            "strengths": ["Clear communication", "Good knowledge of React hooks", "Strong problem solving"],
            "weaknesses": ["Missed edge cases", "Weak on CSS Grid", "Spoke too fast"],
            "suggestion": "Focus on deep diving into CSS Layouts and accessible design patterns.",
            "summary": "A brief 2-sentence summary of the candidate's performance."
        }}
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        
        # Robust JSON cleaning
        if text_response.startswith('```json'):
            text_response = text_response.split('```json')[1]
        if text_response.endswith('```'):
            text_response = text_response.split('```')[0]
        text_response = text_response.strip()

        result = json.loads(text_response)
        return jsonify(result)
        
    except Exception as e:
        print("Interview End Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/assessment/generate', methods=['POST'])
def generate_assessment():
    try:
        data = request.json
        topic = data.get('topic', 'General')
        difficulty = data.get('difficulty', 'Intermediate')
        count = data.get('count', 5)
        
        print(f"Generating Assessment: {topic} ({difficulty}) - {count} Qs")
        
        prompt = f"""
        Act as a Technical Interviewer.
        Generate a multiple-choice skill assessment for:
        - Topic: {topic}
        - Difficulty: {difficulty}
        - Question Count: {count}
        
        REQUIREMENTS:
        1. Questions must be technical and test practical knowledge (code snippets allowed).
        2. Provide 4 options for each question.
        3. Clearly mark the correct answer index (0-3).
        4. Provide a brief explanation for the correct answer.
        
        JSON OUTPUT:
        [
            {{
                "question": "What is the output of console.log(typeof null)?",
                "options": ["object", "null", "undefined", "number"],
                "correct_index": 0,
                "explanation": "In JavaScript, typeof null returns 'object' due to a legacy bug."
            }}
        ]
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        
        # Robust JSON cleaning
        if text_response.startswith('```json'):
            text_response = text_response.split('```json')[1]
        if text_response.endswith('```'):
            text_response = text_response.split('```')[0]
        text_response = text_response.strip()

        result = json.loads(text_response)
        return jsonify(result)
        
    except Exception as e:
        print("Assessment Gen Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/code/generate', methods=['POST'])
def generate_code_problem():
    try:
        data = request.json
        title = data.get('title')
        topic = data.get('topic')
        difficulty = data.get('difficulty', 'Medium')
        
        print(f"Generating Code Problem: {title} ({topic})")
        
        prompt = f"""
        Act as a LeetCode problem generator.
        Generate the details for the coding problem: "{title}" (Topic: {topic}, Difficulty: {difficulty}).
        
        REQUIREMENTS:
        1. **description**: detailed HTML description with examples. Use <code> tags for code.
        2. **starter_code**: Python class/function signature.
        3. **test_suite**: Python code that instantiates the class/function and runs 3 test cases, printing ONLY the output.
           - Format: `print(Solution().func(input))`
        
        JSON OUTPUT FORMAT:
        {{
            "description": "<div>...</div>",
            "starter_code": "class Solution:\\n    def func(self, args):\\n        pass",
            "test_suite": "s = Solution()\\nprint(s.func(...))",
            "examples": [
                {{ "input": "...", "output": "..." }}
            ]
        }}
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        
        # Robust JSON cleaning
        if text_response.startswith('```json'):
            text_response = text_response.split('```json')[1]
        if text_response.endswith('```'):
            text_response = text_response.split('```')[0]
        text_response = text_response.strip()

        result = json.loads(text_response)
        return jsonify(result)
        
    except Exception as e:
        print("Code Gen Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
