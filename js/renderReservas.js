import { reservasService } from "./reservasService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("reservasContainer");
  const saludo = document.getElementById("usuarioSaludo");
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  
  if (usuario) {
    saludo.textContent = `Hola ${usuario.nombre} ${usuario.apellido} 👋`;
  }

  try {
    const reservas = await reservasService.listar();

    // Filtramos solo las del usuario actual
    const reservasUsuario = reservas.filter(r => r.usuario_id === usuario.id);

    if (reservasUsuario.length === 0) {
      container.innerHTML = "<p>No tenés reservas registradas aún.</p>";
      return;
    }

    reservasUsuario.forEach(reserva => {
      const card = document.createElement("div");
      card.className = "reserva-card";

      card.innerHTML = `
        <p><strong>Paquete ID:</strong> ${reserva.paquete_id}</p>
        <p><strong>Fecha reserva:</strong> ${reserva.fecha_reserva}</p>
        <p><strong>Cantidad personas:</strong> ${reserva.cantidad_personas}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<p>Error al cargar reservas: ${error.message}</p>`;
  }
});
