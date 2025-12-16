const API_URL = 'http://127.0.0.1:5005/api';

async function testRoadmap() {
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'refined@example.com',
                password: 'password123'
            })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);

        const token = loginData.token;
        console.log("   Success! Token:", token.substring(0, 10) + "...");

        console.log("2. Generating Roadmap...");
        const roadmapRes = await fetch(`${API_URL}/roadmap/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                careerGoal: 'Frontend Developer',
                experienceLevel: 'Junior (0-2 years)'
            })
        });

        const roadmapData = await roadmapRes.json();
        if (!roadmapRes.ok) throw new Error(roadmapData.message || roadmapRes.statusText);

        console.log("   Success! Roadmap generated.");
        console.log("   Career Goal:", roadmapData.careerGoal);
        console.log("   First Step:", roadmapData.roadmap[0].title);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testRoadmap();
