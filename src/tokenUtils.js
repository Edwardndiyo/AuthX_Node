const jwt = require('jsonwebtoken');
const { isTokenRevoked } = require('./redisUtils');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TIME = '1h';  // 1 hour expiration time

function isPasswordSecure(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Register User: Generates JWT Token
// function registerUser(username, password) {
//     const user = { username, password };  // In a real-world app, you would hash the password and store it securely
//     return user;
// }


function registerUser(username, password) {
    if (!isPasswordSecure(password)) {
        throw new Error('Password must include one uppercase, one number, and one special character');
    }
    const user = { username, password }; // Hash password securely in production
    return user;
}

// Login User: Generates JWT Token
function loginUser(username, password, role) {
    const payload = { username, role }; // Add roles
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
    return token;
}


// Refresh Token Logic: Provides a new token based on the old one
function refreshToken(oldToken) {
    try {
        const decoded = jwt.verify(oldToken, SECRET_KEY);
        const newToken = jwt.sign({ username: decoded.username }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
        return newToken;
    } catch (error) {
        throw new Error('Token expired. Please log in again.');
    }
}

// Token Verification Utility
// function verifyToken(token) {
//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         return decoded;
//     } catch (error) {
//         throw new Error('Invalid token');
//     }
// }


async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const isRevoked = await isTokenRevoked(decoded.jti);
        if (isRevoked) throw new Error('Token has been revoked');
        return decoded;
    } catch (error) {
        throw new Error('Invalid or revoked token');
    }
}

module.exports = { registerUser, loginUser, refreshToken, verifyToken };
