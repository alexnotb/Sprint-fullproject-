document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.getElementById("create-btn");
  const loginButton = document.querySelector("button");

  // Проверка авторизации при загрузке страницы
  fetch("http://localhost:3000/check-auth", {
      method: "GET",
      credentials: "include"
  })
  .then(response => response.json())
  .then(data => {
      if (data.authenticated) {
          window.location.href = "/sprint1/pages/home";
      }
  })
  .catch(error => console.error("Ошибка проверки авторизации", error));

  if (signupButton) {
      signupButton.addEventListener("click", async () => {
          const username = document.getElementById("first-name").value;
          const password = document.getElementById("password").value;
          const confirmPassword = document.getElementById("confirm-password").value;

          if (password !== confirmPassword) {
              alert("Passwords do not match!");
              return;
          }

          const response = await fetch("http://localhost:3000/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
              credentials: "include"
          });
          
          const data = await response.json();
          alert(data.message);
      });
  }

  if (loginButton) {
      loginButton.addEventListener("click", async () => {
          const username = document.getElementById("first-name").value;
          const password = document.getElementById("password").value;

          const response = await fetch("http://localhost:3000/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
              credentials: "include"
          });
          
          const data = await response.json();
          alert(data.message);
          
          if (response.ok) {
              window.location.href = "/sprint1/pages/home"; // Перенаправление после успешного входа
          }
      });
  }
});
