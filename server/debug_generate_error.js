const axios = require('axios');

async function debugGen() {
    try {
        // 1. Signup a fresh user to get a token
        console.log("1. Creating Temp User...");
        const email = `debug_${Date.now()}@test.com`;
        const registerRes = await axios.post('http://127.0.0.1:5005/api/auth/register', {
            name: "Debug User",
            email: email,
            password: "password123"
        });
        const token = registerRes.data.token;
        console.log("   User created. Token:", token ? "YES" : "NO");

        // 2. Send the exact payload causing the error
        console.log("2. Sending Failing Payload...");
        const payload = {
            careerGoal: "Frontend Developer",
            currentSkills: ["JavaScript", "CSS", "HTML"],
            experienceLevel: "Intern/Student",
            githubLink: "",
            learningStyle: "Documentation & Books",
            targetCompany: "FAANG/Big Tech",
            weeklyHours: 20
        };

        const res = await axios.post('http://127.0.0.1:5005/api/roadmap/generate', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("3. SUCCESS!");
        console.log(JSON.stringify(res.data, null, 2));

    } catch (error) {
        console.error("3. FAILED");
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", error.response.data);
        } else {
            console.error("   Error:", error.message);
        }
    }
}

debugGen();
