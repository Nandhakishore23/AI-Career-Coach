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
