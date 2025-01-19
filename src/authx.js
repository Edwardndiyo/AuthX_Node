const bcrypt = require('bcrypt');

/**
 * Validates password security using a regex pattern.
 * A secure password must include:
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 * - Minimum length of 8 characters
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password meets the criteria, otherwise false.
 */
function isPasswordSecure(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

/**
 * Registers a user by hashing their password for secure storage.
 * @param {string} username - The username of the user.
 * @param {string} password - The plain-text password of the user.
 * @throws {Error} - If the password does not meet security criteria.
 * @returns {Object} - An object containing the username and hashed password.
 */
async function register(username, password) {
    if (!isPasswordSecure(password)) {
        throw new Error('Password must include one uppercase letter, one number, and one special character.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return { username, password: hashedPassword };
}

module.exports = { isPasswordSecure, register };
