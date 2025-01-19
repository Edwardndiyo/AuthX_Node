
// const { SignJWT, jwtVerify } = require('jose'); // Correct import from 'jose'
// const { isTokenRevoked } = require('./redisUtils');
// require('dotenv').config();

// const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const EXPIRATION_TIME = 3600; // Token validity in seconds (1 hour)

// // Generate a token
// async function generateToken(payload) {
//     const encoder = new TextEncoder();
//     const key = encoder.encode(SECRET_KEY);
//     const jwt = await new SignJWT(payload) // Create the token
//         .setProtectedHeader({ alg: 'HS256' }) // Specify the signing algorithm
//         .setExpirationTime(Date.now() + EXPIRATION_TIME * 1000) // Set expiration time
//         .sign(key); // Sign the token with the key
//     return jwt;
// }

// // Login user and generate a token
// async function loginUser(username, password, role) {
//     const payload = { username, role, jti: `${username}-${Date.now()}`, exp: Date.now() + EXPIRATION_TIME * 1000 };
//     const encoder = new TextEncoder();
//     const key = encoder.encode(SECRET_KEY);
//     const jwt = await new SignJWT(payload) // Create the token
//         .setProtectedHeader({ alg: 'HS256' }) // Specify the signing algorithm
//         .setExpirationTime(Date.now() + EXPIRATION_TIME * 1000) // Set expiration time
//         .sign(key); // Sign the token with the key
//     return jwt;
// }

// // Verify the token
// async function verifyToken(token) {
//     try {
//         const encoder = new TextEncoder();
//         const key = encoder.encode(SECRET_KEY);
//         const { payload } = await jwtVerify(token, key); // Verify the token
//         const isRevoked = await isTokenRevoked(payload.jti);
//         if (isRevoked) throw new Error('Token has been revoked');
//         return payload;
//     } catch (error) {
//         throw new Error('Invalid or revoked token');
//     }
// }

// // Refresh the token
// async function refreshToken(oldToken) {
//     try {
//         const encoder = new TextEncoder();
//         const key = encoder.encode(SECRET_KEY);
//         const { payload } = await jwtVerify(oldToken, key); // Verify the old token

//         if (Date.now() > payload.exp) throw new Error('Token expired. Please log in again.');

//         const newPayload = { ...payload, exp: Date.now() + EXPIRATION_TIME * 1000 };
//         const jwt = await new SignJWT(newPayload) // Create the new token
//             .setProtectedHeader({ alg: 'HS256' }) // Specify the signing algorithm
//             .setExpirationTime(Date.now() + EXPIRATION_TIME * 1000) // Set new expiration time
//             .sign(key); // Sign the new token with the key
//         return jwt;
//     } catch (error) {
//         throw new Error('Invalid or expired token');
//     }
// }

// module.exports = { generateToken, loginUser, verifyToken, refreshToken };




const { SignJWT, jwtVerify } = require('jose'); // Import JWT utilities from 'jose'
const { isTokenRevoked } = require('./redisUtils');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TIME = 3600; // Token validity in seconds (1 hour)

// Helper function to encode the secret key
function getEncodedKey(secretKey) {
    const encoder = new TextEncoder();
    return encoder.encode(secretKey);
}

// Generate a token
async function generateToken(payload) {
    const key = getEncodedKey(SECRET_KEY);
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' }) // Signing algorithm
        .setExpirationTime('1h') // Expiry time in ISO 8601 format
        .sign(key); // Sign with the secret key
}

// Login user and generate a token
async function loginUser(username, role) {
    const key = getEncodedKey(SECRET_KEY);
    const payload = {
        username,
        role,
        jti: `${username}-${Date.now()}`, // Unique token identifier
        exp: Math.floor(Date.now() / 1000) + EXPIRATION_TIME, // Expiry time in seconds
    };

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(key);
}

// Verify the token
async function verifyToken(token) {
    try {
        const key = getEncodedKey(SECRET_KEY);
        const { payload } = await jwtVerify(token, key); // Verify token and extract payload

        // Check if token has been revoked
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
        const key = getEncodedKey(SECRET_KEY);
        const { payload } = await jwtVerify(oldToken, key); // Verify the old token

        // Check if token has expired
        if (Math.floor(Date.now() / 1000) > payload.exp) {
            throw new Error('Token expired. Please log in again.');
        }

        // Generate a new token with updated expiration
        const newPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + EXPIRATION_TIME };
        return await new SignJWT(newPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .sign(key);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = { generateToken, loginUser, verifyToken, refreshToken };
