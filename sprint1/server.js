const sqlite3 = require('sqlite3').verbose();

// Создаём подключение к базе данных
const db = new sqlite3.Database('./userDB.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к SQLite:', err);
  } else {
    console.log('Подключено к SQLite');
  }
});

// Создаём таблицу пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Ошибка при создании таблицы:', err);
  } else {
    console.log('Таблица users создана или уже существует');
  }
});
