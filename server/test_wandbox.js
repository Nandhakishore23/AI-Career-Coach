const axios = require('axios');

const run = async () => {
    try {
        console.log("Testing Wandbox API...");
        const response = await axios.post('https://wandbox.org/api/compile.json', {
            code: 'print("Hello Wandbox")',
            compiler: 'cpython-3.10.2', // Python 3.10
            save: false
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
