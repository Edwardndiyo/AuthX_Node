// process.env.USE_MOCK_REDIS = 'true'; // Use mock Redis for testing
// process.env.JWT_SECRET_KEY = 'mySecretKey'; // Set a test secret key

// const { register, loginUser, verifyToken, refreshToken } = require('./src/tokenUtils');
// const { revokeToken } = require('./src/redisUtils');

// (async () => {
//     try {
//         // Register a user
//         const user = register('john_doe', 'Password@123');
//         console.log('Registered User:', user);

//         // Login and generate a token
//         const token = loginUser(user.username, user.password, 'user');
//         console.log('Login Token:', token);

//         // Verify the token
//         const decoded = await verifyToken(token);
//         console.log('Decoded Token:', decoded);

//         // Revoke the token
//         await revokeToken(decoded.jti);
//         console.log('Token Revoked');

//         // Try verifying the token again after revocation
//         try {
//             await verifyToken(token);
//         } catch (error) {
//             console.log('Verification After Revocation:', error.message);
//         }
//     } catch (error) {
//         console.error(error.message);
//     }
// })();




// process.env.USE_MOCK_REDIS = 'true';
// process.env.JWT_SECRET_KEY = 'mySecretKey'; // For testing only

// const { register } = require('./src/authx');
// const { loginUser, verifyToken, refreshToken } = require('./src/tokenUtils');
// const { revokeToken } = require('./src/redisUtils');

// (async () => {
//     try {
//         // Register a user
//         const user = await register('john_doe', 'Password@123');
//         console.log('Registered User:', user);

//         // Login and generate a token
//         const token = await loginUser(user.username, 'Password@123', 'user');
//         console.log('Login Token:', token);

//         // Verify the token
//         const decoded = await verifyToken(token);
//         console.log('Decoded Token:', decoded);

//         // Revoke the token
//         await revokeToken(decoded.jti);
//         console.log('Token Revoked');

//         // Try verifying the token again
//         try {
//             await verifyToken(token);
//         } catch (error) {
//             console.log('Verification After Revocation:', error.message);
//         }

//         // Refresh the token
//         const newToken = await refreshToken(token);
//         console.log('Refreshed Token:', newToken);
//     } catch (error) {
//         console.error(error.message);
//     }
// })();


process.env.USE_MOCK_REDIS = 'true'; // Mock Redis for testing
process.env.JWT_SECRET_KEY = 'EdwardEssienNdiyo'; // For testing only

const { register } = require('./src/authx'); // Assuming this has the user registration logic
const { generateToken, verifyToken, refreshToken } = require('./src/tokenUtils');
const { revokeToken } = require('./src/redisUtils');

(async () => {
    try {
        // Register a user
        const user = await register('john_doe', 'Password@123');
        console.log('Registered User:', user);

        // Generate a token
        const token = await generateToken({ username: user.username, role: 'user' });
        console.log('Generated Token:', token);

        // Verify the token
        const decoded = await verifyToken(token);
        console.log('Decoded Token:', decoded);

        // Revoke the token
        await revokeToken(decoded.jti);
        console.log('Token Revoked');

        // Try verifying the token again
        try {
            await verifyToken(token);
        } catch (error) {
            console.log('Verification After Revocation:', error.message);
        }

        // Refresh the token
        const newToken = await refreshToken(token);
        console.log('Refreshed Token:', newToken);
    } catch (error) {
        console.error('Error in the process:', error.message);
    }
})();
