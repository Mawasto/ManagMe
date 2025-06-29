import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';

const SECRET = 'supersecretkey';
const REFRESH_SECRET = 'refreshsecretkey';
const TOKEN_EXP = '15m';
const REFRESH_EXP = '7d';

const users = [
    { id: '1', login: 'admin', password: 'admin', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
    { id: '2', login: 'dev', password: 'dev', firstName: 'Anna', lastName: 'Nowak', role: 'developer' },
    { id: '3', login: 'ops', password: 'ops', firstName: 'Piotr', lastName: 'Wiśniewski', role: 'devops' }
];

const app = express();
app.use(cors());
app.use(bodyParser.json());

function generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: TOKEN_EXP });
}
function generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

app.post('/api/auth/login', (req, res) => {
    const { login, password } = req.body;
    const user = users.find(u => u.login === login && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const { password: _, ...userData } = user;
    res.json({ token, refreshToken, user: userData });
});

app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = users.find(u => u.id === payload.id);
        if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
        const token = generateToken(user);
        res.json({ token });
    } catch {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

app.get('/api/auth/me', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, SECRET);
        const user = users.find(u => u.id === payload.id);
        if (!user) return res.status(401).json({ error: 'Invalid token' });
        const { password: _, ...userData } = user;
        res.json(userData);
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log('Auth API running on port', PORT));
