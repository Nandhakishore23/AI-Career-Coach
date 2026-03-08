const axios = require('axios');

const run = async () => {
    try {
        console.log("Testing Judge0 CE API...");
        const response = await axios.post('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
            source_code: 'print("Hello Judge0")',
            language_id: 71, // Python 3.8.1 (71)
            stdin: ""
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
