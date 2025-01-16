// const { register, login} = require('./src/authx');
// const { verifyToken } = require('./src/tokenUtils');


// // Register a user
// console.log(register('john_doe', 'password123')); 
// console.log(register('john_doe', 'password123')); 

// // Login and get a token
// const token = login('john_doe', 'password123'); // Logging in with the correct password
// console.log('Login Token:', token);

// // Verify the token
// const decoded = verifyToken(token); // Verifying the token
// console.log('Decoded Token:', decoded);




process.env.USE_MOCK_REDIS = 'true'; // Use mock Redis for testing
process.env.JWT_SECRET_KEY = 'mySecretKey'; // Set a test secret key

const { registerUser, loginUser, verifyToken, refreshToken } = require('./src/tokenUtils');
const { revokeToken } = require('./src/redisUtils');

(async () => {
    try {
        // Register a user
        const user = registerUser('john_doe', 'Password@123');
        console.log('Registered User:', user);

        // Login and generate a token
        const token = loginUser(user.username, user.password, 'user');
        console.log('Login Token:', token);

        // Verify the token
        const decoded = await verifyToken(token);
        console.log('Decoded Token:', decoded);

        // Revoke the token
        await revokeToken(decoded.jti);
        console.log('Token Revoked');

        // Try verifying the token again after revocation
        try {
            await verifyToken(token);
        } catch (error) {
            console.log('Verification After Revocation:', error.message);
        }
    } catch (error) {
        console.error(error.message);
    }
})();
