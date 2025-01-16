const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware for role-based access
function authorize(requiredRole) {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY);
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Access denied' });
            }
            req.user = decoded; // Attach user info to request object
            next();
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized' });
        }
    };
}

module.exports = { authorize };
