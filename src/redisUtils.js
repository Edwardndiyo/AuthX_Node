
const redisMock = new Map();

async function revokeToken(jti) {
    redisMock.set(jti, 'revoked');
    setTimeout(() => redisMock.delete(jti), 3600 * 1000); // Simulate expiry after 1 hour
}

async function isTokenRevoked(jti) {
    return redisMock.has(jti);
}

module.exports = { revokeToken, isTokenRevoked };
