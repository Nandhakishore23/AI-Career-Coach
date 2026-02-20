const axios = require('axios');

const run = async () => {
    try {
        console.log("Testing Piston API with User-Agent...");
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            language: 'python',
            version: '3.10.0',
            files: [{ content: 'print("Hello Piston")' }]
        }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Content-Type': 'application/json'
            }
        });
        console.log("Success:", response.data);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
};

run();
