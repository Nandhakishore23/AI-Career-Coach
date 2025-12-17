const axios = require('axios');

async function testGen() {
    try {
        console.log("1. Signing up new user...");
        const email = `test_${Date.now()}@example.com`;

        const signupRes = await axios.post('http://127.0.0.1:5005/api/auth/register', {
            name: "AI Test User",
            email: email,
            password: "password"
        });
        const token = signupRes.data.token;
        console.log(`   User ${email} created. Token acquired.`);

        console.log("2. Requesting AI Roadmap (this may take time)...");
        const genRes = await axios.post('http://127.0.0.1:5005/api/roadmap/generate', {
            careerGoal: "Full Stack Developer",
            experienceLevel: "Junior",
            targetCompany: "Startup",
            weeklyHours: 20,
            learningStyle: "Project-Based",
            currentSkills: ["HTML", "CSS"],
            githubLink: ""
        }, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 60000 // 60s timeout
        });

        console.log("3. Success!");
        console.log(JSON.stringify(genRes.data.roadmap, null, 2));

    } catch (error) {
        console.error("X. FAILED");
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", error.response.data);
        } else {
            console.error("   Error:", error.message);
        }
    }
}

testGen();
