import { authService } from "./authService.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const container = document.querySelector(".login-container");

  const usuarioLogueado = sessionStorage.getItem("token");

  if (usuarioLogueado) {
    container.innerHTML = `<h2>Sesión activa</h2><p>Redirigiendo a destinos...</p>`;
    setTimeout(() => {
      window.location.href = "destinos.html";
    }, 1500);
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await authService.login(email, password);
      console.log("Respuesta del backend:", response);

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("usuario", JSON.stringify(response.usuario));
      console.log("Usuario guardado en sessionStorage:", response.usuario);

      alert(`¡Bienvenido ${response.usuario.nombre} ${response.usuario.apellido}!`);
      window.location.href = "destinos.html";
    } catch (err) {
      alert("Error de autenticación: " + err.message);
    }
  });
});
