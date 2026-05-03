const http = require('http');

async function testApi() {
    console.log('--- Starting API Tests ---\n');

    const baseUrl = 'http://127.0.0.1:5000/api';
    let token = '';

    // 1. Test Registration
    console.log('1. Testing Patient Registration (POST /auth/register)...');
    try {
        const regRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: `test${Date.now()}@test.com`,
                password: "password123",
                role: "patient"
            })
        });
        const regData = await regRes.json();
        if (regRes.ok) {
            console.log('✅ Registration Successful!');
            if (regData.token) {
                token = regData.token;
                console.log('✅ Received JWT Token');
            }
        } else {
            console.log('❌ Registration Failed:', regData);
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // 2. Test Fetching Profile (Protected Route)
    if (token) {
        console.log('\n2. Testing Protected Route (GET /patient/profile)...');
        try {
            const profRes = await fetch(`${baseUrl}/patient/profile`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const profData = await profRes.json();
            if (profRes.ok) {
                console.log('✅ Profile Fetched Successfully!');
                console.log('   User Name:', profData.name);
            } else {
                console.log('❌ Fetch Profile Failed:', profData);
            }
        } catch (e) {
            console.log('❌ Error:', e.message);
        }
    }

    console.log('\n--- API Tests Complete ---');
}

testApi();
