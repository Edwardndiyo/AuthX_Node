
// const jwt = require('jsonwebtoken');
// const { isTokenRevoked } = require('./redisUtils');
// require('dotenv').config();

// const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const EXPIRATION_TIME = '1h'; // 1 hour expiration time

// function isPasswordSecure(password) {
//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
// }

// function registerUser(username, password) {
//     if (!isPasswordSecure(password)) {
//         throw new Error('Password must include one uppercase, one number, and one special character');
//     }
//     const user = { username, password }; // Hash password securely in production
//     return user;
// }

// function loginUser(username, password, role) {
//     const payload = { username, role, jti: `${username}-${Date.now()}` }; // Adding a unique JWT ID
//     const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
//     return token;
// }

// function refreshToken(oldToken) {
//     try {
//         const decoded = jwt.verify(oldToken, SECRET_KEY);
//         const newToken = jwt.sign({ username: decoded.username, role: decoded.role }, SECRET_KEY, {
//             expiresIn: EXPIRATION_TIME,
//         });
//         return newToken;
//     } catch (error) {
//         throw new Error('Token expired. Please log in again.');
//     }
// }

// async function verifyToken(token) {
//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         const isRevoked = await isTokenRevoked(decoded.jti);
//         if (isRevoked) throw new Error('Token has been revoked');
//         return decoded;
//     } catch (error) {
//         throw new Error('Invalid or revoked token');
//     }
// }

// module.exports = { registerUser, loginUser, refreshToken, verifyToken };



// const { jwtEncrypt, jwtDecrypt } = require('jose');
// const { isTokenRevoked } = require('./redisUtils');
// require('dotenv').config();

// const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const EXPIRATION_TIME = 3600; // Token validity in seconds (1 hour)

// async function loginUser(username, password, role) {
//     const payload = { username, role, jti: `${username}-${Date.now()}`, exp: Date.now() + EXPIRATION_TIME * 1000 };
//     const key = Buffer.from(SECRET_KEY, 'base64');
//     return await jwtEncrypt(payload, key, { alg: 'A256GCM', enc: 'A256GCM', typ: 'JWT' });
// }

// async function verifyToken(token) {
//     try {
//         const decoded = await jwtDecrypt(token, Buffer.from(SECRET_KEY, 'base64'));
//         const isRevoked = await isTokenRevoked(decoded.payload.jti);
//         if (isRevoked) throw new Error('Token has been revoked');
//         return decoded.payload;
//     } catch (error) {
//         throw new Error('Invalid or revoked token');
//     }
// }

// async function refreshToken(oldToken) {
//     try {
//         const decoded = await jwtDecrypt(oldToken, Buffer.from(SECRET_KEY, 'base64'));
//         if (Date.now() > decoded.payload.exp) throw new Error('Token expired. Please log in again.');

//         const newPayload = { ...decoded.payload, exp: Date.now() + EXPIRATION_TIME * 1000 };
//         const key = Buffer.from(SECRET_KEY, 'base64');
//         return await jwtEncrypt(newPayload, key, { alg: 'A256GCM', enc: 'A256GCM', typ: 'JWT' });
//     } catch (error) {
//         throw new Error('Invalid or expired token');
//     }
// }

// module.exports = { loginUser, verifyToken, refreshToken };




// const { jwtSign, jwtVerify } = require('jose');
// const { isTokenRevoked } = require('./redisUtils');
// require('dotenv').config();

// const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const EXPIRATION_TIME = 3600; // Token validity in seconds (1 hour)

// async function loginUser(username, password, role) {
//     const payload = { username, role, jti: `${username}-${Date.now()}`, exp: Date.now() + EXPIRATION_TIME * 1000 };
//     const key = Buffer.from(SECRET_KEY, 'base64');
//     return await jwtSign(payload, key, { alg: 'HS256' }); // Use HS256 for signing the JWT
// }


// async function verifyToken(token) {
//     try {
//         const key = Buffer.from(process.env.JWT_SECRET_KEY, 'base64');
//         const decoded = await jwtVerify(token, key);
//         console.log('Decoded Token:', decoded);
//         const isRevoked = await isTokenRevoked(decoded.payload.jti);
//         if (isRevoked) throw new Error('Token has been revoked');
//         return decoded.payload;
//     } catch (error) {
//         console.error('Error verifying token:', error.message);
//         throw new Error('Invalid or revoked token');
//     }
// }

// // async function verifyToken(token) {
// //     try {
// //         const key = Buffer.from(SECRET_KEY, 'base64');
// //         const decoded = await jwtVerify(token, key); // Use jwtVerify for verifying the JWT
// //         const isRevoked = await isTokenRevoked(decoded.payload.jti);
// //         if (isRevoked) throw new Error('Token has been revoked');
// //         return decoded.payload;
// //     } catch (error) {
// //         throw new Error('Invalid or revoked token');
// //     }
// // }

// async function refreshToken(oldToken) {
//     try {
//         const key = Buffer.from(SECRET_KEY, 'base64');
//         const decoded = await jwtVerify(oldToken, key); // Verifies the old token
//         if (Date.now() > decoded.payload.exp) throw new Error('Token expired. Please log in again.');

//         // Create a new payload with a fresh expiration time
//         const newPayload = { ...decoded.payload, exp: Date.now() + EXPIRATION_TIME * 1000 };
//         return await jwtSign(newPayload, key, { alg: 'HS256' }); // Sign the new token with the updated expiration
//     } catch (error) {
//         throw new Error('Invalid or expired token');
//     }
// }

// module.exports = { loginUser, verifyToken, refreshToken };


const { SignJWT, jwtVerify } = require('jose'); // Correct import from 'jose'
const { isTokenRevoked } = require('./redisUtils');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TIME = 3600; // Token validity in seconds (1 hour)

// Generate a token
async function generateToken(payload) {
    const encoder = new TextEncoder();
    const key = encoder.encode(SECRET_KEY);
    const jwt = await new SignJWT(payload) // Create the token
        .setProtectedHeader({ alg: 'HS256' }) // Specify the signing algorithm
        .setExpirationTime(Date.now() + EXPIRATION_TIME * 1000) // Set expiration time
        .sign(key); // Sign the token with the key
    return jwt;
}

// Login user and generate a token
async function loginUser(username, password, role) {
    const payload = { username, role, jti: `${username}-${Date.now()}`, exp: Date.now() + EXPIRATION_TIME * 1000 };
    const encoder = new TextEncoder();
    const key = encoder.encode(SECRET_KEY);
    const jwt = await new SignJWT(payload) // Create the token
        .setProtectedHeader({ alg: 'HS256' }) // Specify the signing algorithm
        .setExpirationTime(Date.now() + EXPIRATION_TIME * 1000) // Set expiration time
        .sign(key); // Sign the token with the key
    return jwt;
}

// Verify the token
async function verifyToken(token) {
    try {
        const encoder = new TextEncoder();
        const key = encoder.encode(SECRET_KEY);
        const { payload } = await jwtVerify(token, key); // Verify the token
        const isRevoked = await isTokenRevoked(payload.jti);
        if (isRevoked) throw new Error('Token has been revoked');
        return payload;
    } catch (error) {
        throw new Error('Invalid or revoked token');
    }
}

// Refresh the token
async function refreshToken(oldToken) {
    try {
        const encoder = new TextEncoder();
        const key = encoder.encode(SECRET_KEY);
        const { payload } = await jwtVerify(oldToken, key); // Verify the old token

        if (Date.now() > payload.exp) throw new Error('Token expired. Please log in again.');

        const newPayload = { ...payload, exp: Date.now() + EXPIRATION_TIME * 1000 };
        const jwt = await new SignJWT(newPayload) // Create the new token
            .setProtectedHeader({ alg: 'HS256' }) // Specify the signing algorithm
            .setExpirationTime(Date.now() + EXPIRATION_TIME * 1000) // Set new expiration time
            .sign(key); // Sign the new token with the key
        return jwt;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = { generateToken, loginUser, verifyToken, refreshToken };
