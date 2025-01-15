const express = require('express');
const { register, login } = require('./src/authx');
const { assignRole } = require('./src/roles');
const { verifyToken } = require('./src/tokenUtils');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = register(username, password);
    res.status(201).send(`User registered: ${user.username}`);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const token = login(username, password);
    res.status(200).send({ token });
});

app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    try {
        const decoded = verifyToken(token);
        res.status(200).send(decoded);
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
