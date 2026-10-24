
const mongoose = require('mongoose');
const http = require('http');
const { hash } = require('bcryptjs');

// Minimal User Schema for the script
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    name: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

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

async function run() {
    console.log('🧪 Starting Credentials Auth Verification...');

    // Connect to DB (using env var or hardcoded local for test if needed, assuming local env has it)
    // We'll try to read from .env.local if possible, or just default to local mongo
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/word-wiz";

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const testEmail = `test_cred_${Date.now()}@example.com`;
        const testPassword = 'password123';
        const hashedPassword = await hash(testPassword, 10);

        // 1. Create Unapproved User
        const user = await User.create({
            email: testEmail,
            name: 'Test Cred User',
            password: hashedPassword,
            isActive: true,
            isApproved: false // Explicitly unapproved
        });
        console.log(`Created test user: ${testEmail} (isApproved: false)`);

        // 2. Call Validate API
        console.log('Calling /api/auth/validate...');
        const response = await postRequest('/api/auth/validate', {
            email: testEmail,
            password: testPassword
        });

        console.log('Response:', JSON.stringify(response, null, 2));

        // 3. Verify Response
        if (response.isApproved === false) {
            console.log('✅ Credentials Auth: Validate API correctly returns isApproved: false');
        } else {
            console.error('❌ Credentials Auth Failure: isApproved is NOT false!', response);
            process.exit(1);
        }

        // Cleanup
        await User.deleteOne({ email: testEmail });
        console.log('Cleanup complete');

        await mongoose.disconnect();

    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    }
}

run();
