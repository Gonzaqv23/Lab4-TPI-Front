import { destinosService } from "./destinosService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("destinosContainer");
  const saludo = document.getElementById("usuarioSaludo");
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (usuario) {
    saludo.textContent = `Hola ${usuario.nombre} ${usuario.apellido} 👋`;
  }

  try {
    const destinos = await destinosService.listar();
    console.log("Destinos recibidos:", destinos);


    if (destinos.length === 0) {
      container.innerHTML = "<p>No hay destinos disponibles.</p>";
      return;
    }

    destinos.forEach(destino => {
      const card = document.createElement("div");
      card.className = "destino-card";

      card.innerHTML = `
        <h3>${destino.nombre}</h3>
        <p><strong>País:</strong> ${destino.pais}</p>
        <p>${destino.descripcion}</p>
        <button onclick="verPaquetes(${destino.id})">Ver paquetes</button>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<p>Error al cargar destinos: ${error.message}</p>`;
  }
});

window.verPaquetes = (id) => {
  window.location.href = `paquetes.html?destino=${id}`;
};