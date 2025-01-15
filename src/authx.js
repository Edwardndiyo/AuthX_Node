// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// // Simulating a database (for the sake of this example)
// let users = [];

// const SECRET_KEY = 'your-secret-key'; // Replace with a strong, secure key in production

// // Register a new user
// function registerUser(username, password) {
//   // Hash the password before storing it
//   const hashedPassword = bcrypt.hashSync(password, 10);
  
//   const user = { username, password: hashedPassword };
//   users.push(user); // In a real app, you'd save this to a database

//   return 'User registered successfully';
// }

// // Login a user and issue a token
// function loginUser(username, password) {
//   const user = users.find((u) => u.username === username);
  
//   if (!user) {
//     return 'User not found';
//   }
  
//   // Compare the password with the hashed password in the database
//   const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  
//   if (!isPasswordCorrect) {
//     return 'Invalid credentials';
//   }
  
//   // Generate a JWT-like token
//   const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  
//   return token;
// }

// // Example function to verify JWT token (for later use in protecting routes)
// function verifyToken(token) {
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     return decoded;
//   } catch (error) {
//     return 'Invalid or expired token';
//   }
// }

// // Export functions to be used in other files
// module.exports = { registerUser, loginUser, verifyToken };



const { registerUser, loginUser } = require('./tokenUtils');
const { assignRole } = require('./roles');

function register(username, password) {
    const user = registerUser(username, password); // Handle registration
    return user;
}

function login(username, password) {
    const token = loginUser(username, password); // Handle login and JWT token creation
    return token;
}

module.exports = { register, login };
