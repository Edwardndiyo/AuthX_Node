const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TIME = '1h';  // 1 hour expiration time

// Register User: Generates JWT Token
function registerUser(username, password) {
    const user = { username, password };  // In a real-world app, you would hash the password and store it securely
    return user;
}

// Login User: Generates JWT Token
function loginUser(username, password) {
    const payload = { username };
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
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = { registerUser, loginUser, refreshToken, verifyToken };
