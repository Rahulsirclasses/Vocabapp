
const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': jsonData.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(jsonData);
        req.end();
    });
}

async function verify() {
    console.log('🧪 Starting Auth Verification (Native HTTP)...');

    // Test Google Auth
    try {
        console.log('\n--- Testing Google User Lookup/Creation ---');
        const mockGoogleUser = {
            email: `test_google_${Date.now()}@example.com`,
            name: 'Test Google User',
            image: ''
        };

        const data = await postRequest('/api/auth/google-signin', mockGoogleUser);

        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.isApproved === false) {
            console.log('✅ Google Auth: New user correctly marked as Pending (isApproved: false)');
        } else {
            console.log('❌ Google Auth: New user NOT marked as Pending! Data:', data);
            process.exit(1);
        }

    } catch (e) {
        console.error('❌ Google Auth API failed:', e.message);
        process.exit(1);
    }
}

verify();
