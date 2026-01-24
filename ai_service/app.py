import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
