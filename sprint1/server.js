const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite');
    }
});

// Создание таблицы пользователей
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Регистрация
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Введите имя пользователя и пароль' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Ошибка хеширования пароля' });
        
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], (err) => {
            if (err) {
                return res.status(400).json({ message: 'Пользователь уже существует' });
            }
            res.json({ message: 'Регистрация успешна' });
        });
    });
});

// Вход
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                return res.status(401).json({ message: 'Неверный пароль' });
            }
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Вход успешен', token });
        });
    });
});

// Проверка токена
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Неверный токен' });
        req.user = user;
        next();
    });
};

// Профиль (только для авторизованных пользователей)
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Добро пожаловать в профиль', user: req.user });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
