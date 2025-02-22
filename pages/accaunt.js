  // При клике на кнопку собираем данные из полей ввода
  document.getElementById('create-btn').addEventListener('click', function() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Проверяем, что все поля заполнены
    if (!firstName || !lastName || !password || !confirmPassword) {
      alert('Заполните все поля');
      return;
    }
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    else{
      alert('Вы успешно зарегистрировались');
      location.href = '/pages/account/login.html';
      window.location.href = 'http://127.0.0.1:5500/pages/menu/menu.html';
    }

  });














document.addEventListener("DOMContentLoaded", function() {
    // Пример проверки авторизации
    // Здесь можно заменить переменную isLoggedIn реальной логикой проверки,
    // например, получив данные из localStorage, cookie или через AJAX-запрос.
    let isLoggedIn = false; // измените на true, если пользователь авторизован
    let userAvatar = '/image/avatar-placeholder.png'; // URL аватарки или заглушки

    const accountControls = document.querySelector('.account-controls');

    if (isLoggedIn) {
      // Если пользователь авторизован, показываем его аватарку
      accountControls.innerHTML = `
        <img src="${userAvatar}" alt="Аватар пользователя" class="user-avatar" onclick="location.href='/pages/account/account.html';" style="cursor: pointer; width: 40px; height: 40px; border-radius: 50%;">
      `;
    } else {
      // Если не авторизован, оставляем кнопки
      accountControls.innerHTML = `
        <button type="button" onclick="location.href='/pages/account/login.html';">LOGIN</button>
        <button type="button" onclick="location.href='/pages/account/logout.html';">SIGNIN</button>
      `;
    }
  });