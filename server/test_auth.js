const API_URL = 'http://127.0.0.1:5005/api/auth';

const testAuth = async () => {
    try {
        console.log('Testing Connectivity...');
        const res = await fetch(`${API_URL}/`);
        console.log('GET Status:', res.status, await res.text());

        console.log('Testing Registration...');
        const registerRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Setup User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            })
        });

        const text = await registerRes.text();
        let registerData;
        try {
            registerData = JSON.parse(text);
            console.log('Register Response:', registerData);
        } catch (e) {
            console.error('Registration JSON Parse Error. Response Body:', text);
            return;
        }

        if (registerRes.ok) {
            console.log('Testing Login...');
            const loginRes = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerData.email,
                    password: 'password123'
                })
            });
            const loginText = await loginRes.text();
            try {
                const loginData = JSON.parse(loginText);
                console.log('Login Response:', loginData);
            } catch (e) {
                console.error('Login JSON Parse Error. Response Body:', loginText);
            }
        } else {
            console.log('Registration failed with status:', registerRes.status);
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testAuth();
