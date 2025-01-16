let dbConnection = null; // Variable to hold the database connection

// Function to set the MySQL database connection
function setDatabase(connection) {
    dbConnection = connection;
}

// Function to save a user into the database
async function saveUser(user) {
    if (!dbConnection) throw new Error('Database connection is not set');
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const [result] = await dbConnection.execute(query, [user.username, user.password]);
    return result;
}

// Function to find a user by username
async function findUser(username) {
    if (!dbConnection) throw new Error('Database connection is not set');
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await dbConnection.execute(query, [username]);
    return rows[0]; // Return the first result or undefined
}

module.exports = { setDatabase, saveUser, findUser };
