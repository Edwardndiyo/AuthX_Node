const redis = require('redis');
const client = redis.createClient();

// Add token to blacklist
function revokeToken(jti, exp) {
    const ttl = exp - Math.floor(Date.now() / 1000); // Time-to-live for the token
    client.set(jti, true, 'EX', ttl); // Store token in Redis with expiration
}

// Check if token is blacklisted
function isTokenRevoked(jti) {
    return new Promise((resolve, reject) => {
        client.get(jti, (err, data) => {
            if (err) reject(err);
            resolve(data !== null); // Token is revoked if found in Redis
        });
    });
}

async function cacheUserRole(username, role) {
    const key = `userRole:${username}`;
    client.set(key, role, 'EX', 3600); // Cache for 1 hour
}

async function getCachedUserRole(username) {
    return new Promise((resolve, reject) => {
        const key = `userRole:${username}`;
        client.get(key, (err, data) => {
            if (err) reject(err);
            resolve(data); // Return role if cached
        });
    });
}


module.exports = { revokeToken, isTokenRevoked };
