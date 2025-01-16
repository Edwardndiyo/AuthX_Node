// const { registerUser, loginUser } = require('./tokenUtils');
// const { assignRole } = require('./roles');

// function register(username, password) {
//     try {
//         const user = registerUser(username, password);
//         assignRole(username, 'user');
//         return user;
//     } catch (error) {
//         throw new Error(`Registration failed: ${error.message}`);
//     }
// }


// function login(username, password) {
//     try {
//         const token = loginUser(username, password);
//         return token;
//     } catch (error) {
//         throw new Error(`Login failed: ${error.message}`);
//     }
// }

// module.exports = { register, login };










const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TIME = '1h'; // Token expiration time

// Register User: Hash password and return processed data
async function register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { username, password: hashedPassword };
    return userData; // User handles database insertion
}

// Login User: Verify user-provided password and generate JWT
async function login(userFromDb, inputPassword) {
    if (!userFromDb) throw new Error('User not found'); // Ensure user exists
    const isPasswordValid = await bcrypt.compare(inputPassword, userFromDb.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    // Generate JWT token
    const token = jwt.sign({ username: userFromDb.username }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
    return { token, username: userFromDb.username }; // Return token and user data
}

// Refresh JWT: Generate a new token based on an existing one
function refreshToken(oldToken) {
    try {
        const decoded = jwt.verify(oldToken, SECRET_KEY);
        const newToken = jwt.sign({ username: decoded.username }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
        return newToken;
    } catch (error) {
        throw new Error('Invalid or expired token. Please log in again.');
    }
}

// Verify Token: Ensure the JWT is valid
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded; // Return decoded payload
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = { register, login, refreshToken, verifyToken };
