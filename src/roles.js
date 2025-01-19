// const roles = ['admin', 'user'];  // Define valid roles

// // Assign role to user
// function assignRole(user, role) {
//     if (!roles.includes(role)) throw new Error('Invalid role');
//     user.role = role;
//     return user;
// }

// // Middleware to check if a user has the required role
// function authorize(requiredRole) {
//     return (req, res, next) => {
//         const token = req.headers['authorization'];
//         if (!token) return res.status(401).send('Access denied');
        
//         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//             if (err) return res.status(403).send('Invalid token');
//             if (decoded.role !== requiredRole) return res.status(403).send('Insufficient permissions');
//             next();
//         });
//     };
// }

// module.exports = { assignRole, authorize };




const { jwtVerify } = require('jose'); // Use `jose` for token verification
require('dotenv').config();

const roles = ['admin', 'user']; // Define valid roles

// Assign role to a user
function assignRole(user, role) {
    if (!roles.includes(role)) {
        throw new Error(`Invalid role. Valid roles are: ${roles.join(', ')}`);
    }
    user.role = role;
    return user;
}

// Middleware to check if a user has the required role
function authorize(requiredRole) {
    return async (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(401).json({ error: 'Access denied. No token provided.' });
            }

            const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
            const { payload } = await jwtVerify(token, key); // Verify token using `jose`

            if (payload.role !== requiredRole) {
                return res.status(403).json({ error: 'Insufficient permissions.' });
            }

            // Attach the decoded payload to the request for downstream use
            req.user = payload;
            next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid token or authorization failed.' });
        }
    };
}

module.exports = { assignRole, authorize };
