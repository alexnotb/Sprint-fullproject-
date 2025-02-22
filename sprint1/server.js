const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Модель пользователя
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Пользователь зарегистрирован!' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

// Вход пользователя
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user._id;
      res.json({ message: 'Вход успешен!' });
    } else {
      res.status(401).json({ message: 'Неверные данные' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка авторизации' });
  }
});

// Проверка сессии
app.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Выход пользователя
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Выход выполнен' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
