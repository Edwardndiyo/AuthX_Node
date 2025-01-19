// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const EXPIRATION_TIME = '1h'; // Token expiration time

// // Register User: Hash password and return processed data
// async function register(username, password) {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userData = { username, password: hashedPassword };
//     return userData; // User handles database insertion
// }

// // Login User: Verify user-provided password and generate JWT
// async function login(userFromDb, inputPassword) {
//     if (!userFromDb) throw new Error('User not found'); // Ensure user exists
//     const isPasswordValid = await bcrypt.compare(inputPassword, userFromDb.password);
//     if (!isPasswordValid) throw new Error('Invalid password');

//     // Generate JWT token
//     const token = jwt.sign({ username: userFromDb.username }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
//     return { token, username: userFromDb.username }; // Return token and user data
// }

// // Refresh JWT: Generate a new token based on an existing one
// function refreshToken(oldToken) {
//     try {
//         const decoded = jwt.verify(oldToken, SECRET_KEY);
//         const newToken = jwt.sign({ username: decoded.username }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
//         return newToken;
//     } catch (error) {
//         throw new Error('Invalid or expired token. Please log in again.');
//     }
// }

// // Verify Token: Ensure the JWT is valid
// function verifyToken(token) {
//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         return decoded; // Return decoded payload
//     } catch (error) {
//         throw new Error('Invalid token');
//     }
// }

// module.exports = { register, login, refreshToken, verifyToken };




// const bcrypt = require('bcrypt');
// const { jwtEncrypt, jwtDecrypt } = require('jose');

// const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const EXPIRATION_TIME = '1h'; // Token expiration time

// // Register User: Hash password and return processed data
// async function register(username, password) {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userData = { username, password: hashedPassword };
//     return userData; // User handles database insertion
// }

// // Login User: Verify user-provided password and generate JWE
// async function login(userFromDb, inputPassword) {
//     if (!userFromDb) throw new Error('User not found'); // Ensure user exists
//     const isPasswordValid = await bcrypt.compare(inputPassword, userFromDb.password);
//     if (!isPasswordValid) throw new Error('Invalid password');

//     const payload = { username: userFromDb.username, iat: Date.now(), exp: Date.now() + 3600 * 1000 }; // 1-hour expiry
//     const token = await generateToken(payload); // Encrypt token
//     return { token, username: userFromDb.username }; // Return token and user data
// }

// // Verify Token: Ensure the JWE is valid
// async function verifyToken(token) {
//     try {
//         const decoded = await jwtDecrypt(token, Buffer.from(SECRET_KEY, 'base64'));
//         return decoded.payload; // Return decrypted payload
//     } catch (error) {
//         throw new Error('Invalid or revoked token');
//     }
// }

// // Token generation using JWE encryption
// async function generateToken(payload) {
//     const key = Buffer.from(SECRET_KEY, 'base64');
//     return await jwtEncrypt(payload, key, { alg: 'A256GCM', enc: 'A256GCM', typ: 'JWT' });
// }

// module.exports = { register, login, verifyToken };




const bcrypt = require('bcrypt');

function isPasswordSecure(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// async function register(username, password) {
//     if (!isPasswordSecure(password)) {
//         throw new Error('Password must include one uppercase letter, one number, and one special character.');
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     return { username, password: hashedPassword };
// }
async function register(username, password) {
    const user = { username, password: await bcrypt.hash(password, 10) };
    console.log('Registered User in DB:', user);
    return user;
}


module.exports = { isPasswordSecure, register };
