# AuthX - Authentication SDK

A simple, open-source authentication SDK for Node.js, with support for JWT, token revocation, and biometric authentication. It allows developers to integrate authentication into their applications with minimal effort.

## Features:
- JWT authentication (HS256 algorithm)
- Token revocation with Redis integration (optional)
- Biometric authentication simulation (for testing)
- Token refreshing and verification

## Installation

```bash
npm install authx

```


Usage
Example:

const { register, loginUser } = require('authx');
const { generateToken, verifyToken } = require('authx/tokenUtils');
const { authenticateWithBiometrics } = require('authx/biometricUtils');

// Register a user
await register('john_doe', 'Password@123');

// Login and generate a token
const token = await generateToken({ username: 'john_doe', role: 'user' });

// Verify the token
const decoded = await verifyToken(token);
console.log(decoded);

// Biometric Authentication
const biometricResult = await authenticateWithBiometrics('john_doe', biometricData);


Configuration

You can set the following environment variables:

JWT_SECRET_KEY: Secret key for signing JWT tokens.
USE_MOCK_REDIS: Set to true for mock Redis in testing.


Contributing
Feel free to fork the repository and submit pull requests for improvements or bug fixes.


License
MIT License.

vbnet
Copy
Edit

### 3. **Set Up a Versioning System**

Make sure you have proper versioning in place:
- **Package versioning**: Ensure your `package.json` file has a version number. It's a good practice to follow Semantic Versioning (e.g., `1.0.0`, `1.0.1`, etc.). Increment the version number when you make changes (major, minor, patch).
  
Example `package.json`:
```json
{
  "name": "authx",
  "version": "1.0.0",
  "description": "Authentication SDK for Node.js",
  "main": "index.js",
  "scripts": {
    "test": "node test.js"
  },
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "jose": "^4.0.0",
    "crypto": "^1.0.1",
    "redis": "^3.0.2"
  }
}
