const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';
const USERS_FILE = './users.json';

app.use(bodyParser.json());

// Функция чтения пользователей из файла
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

// Функция записи пользователей в файл
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Регистрация
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Введите имя пользователя и пароль' });
    }

    let users = readUsers();
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Ошибка хеширования пароля' });
        
        users.push({ id: users.length + 1, username, password: hash });
        writeUsers(users);
        res.json({ message: 'Регистрация успешна' });
    });
});

// Вход
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();
    let user = users.find(user => user.username === username);
    
    if (!user) {
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
