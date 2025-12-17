const axios = require('axios');

async function testDirect() {
    try {
        console.log("Hitting AI Service Direct (5002)...");
        const res = await axios.post('http://127.0.0.1:5002/generate-roadmap', {
            careerGoal: "Full Stack Developer",
            experienceLevel: "Junior",
            targetCompany: "Startup",
            weeklyHours: 20,
            learningStyle: "Project-Based",
            currentSkills: ["HTML"],
        });
        console.log("Response:");
        console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error(err.response.data);
    }
}
testDirect();
