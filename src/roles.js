const roles = ['admin', 'user'];  // Define valid roles

// Assign role to user
function assignRole(user, role) {
    if (!roles.includes(role)) throw new Error('Invalid role');
    user.role = role;
    return user;
}

// Middleware to check if a user has the required role
function authorize(requiredRole) {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send('Access denied');
        
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).send('Invalid token');
            if (decoded.role !== requiredRole) return res.status(403).send('Insufficient permissions');
            next();
        });
    };
}

module.exports = { assignRole, authorize };
