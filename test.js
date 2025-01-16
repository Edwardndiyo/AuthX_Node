const { register, login} = require('./src/authx');
const { verifyToken } = require('./src/tokenUtils');


// Register a user
console.log(register('john_doe', 'password123')); 
console.log(register('john_doe', 'password123')); 

// Login and get a token
const token = login('john_doe', 'password123'); // Logging in with the correct password
console.log('Login Token:', token);

// Verify the token
const decoded = verifyToken(token); // Verifying the token
console.log('Decoded Token:', decoded);
