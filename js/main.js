import { authService } from "./authService.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const container = document.querySelector(".login-container");

  const token = sessionStorage.getItem("token");
  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  if (token) {

    fetch("http://localhost:8000/usuarios", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Token expirado");
        
        container.innerHTML = `<h2>Sesión activa</h2><p>Redirigiendo...</p>`;
        const rol = usuario.rol?.toLowerCase();
        const destino = rol === "admin" ? "dashboard.html" : "destinos.html";
        setTimeout(() => (window.location.href = destino), 1000);
      })
      .catch(err => {
        
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        console.warn("Token inválido o expirado. Sesión limpia.");
      });

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

      const rol = response.usuario.rol.toLowerCase();

      console.log(rol)

      if (rol === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "destinos.html";
      }

    } catch (err) {
      alert("Error de autenticación: " + err.message);
    }
  });
});