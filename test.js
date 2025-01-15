const { register, login} = require('./src/authx'); // Import the required functions
const { registerUser, loginUser, verifyToken } = require('./src/tokenUtils');


// Register a user
console.log(register('john_doe', 'password123')); // Registering a user
console.log(register('john_doe', 'password123')); // Attempting to register again (should handle this gracefully)

// Login and get a token
const token = login('john_doe', 'password123'); // Logging in with the correct password
console.log('Login Token:', token);

// Verify the token
const decoded = verifyToken(token); // Verifying the token
console.log('Decoded Token:', decoded);
