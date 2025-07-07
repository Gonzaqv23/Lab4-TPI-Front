import { paquetesService } from "./paquetesService.js";
import { reservasService } from "./reservasService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("paquetesContainer");
  const saludo = document.getElementById("usuarioSaludo");
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const params = new URLSearchParams(window.location.search);
  const destinoId = params.get("destino");

  console.log("ID de destino recibido:", destinoId);
  console.log(usuario)

  if (!destinoId) {
    alert("No se seleccionó ningún destino.");
  }

  if (usuario) {
    saludo.textContent = `Hola ${usuario.nombre} ${usuario.apellido} 👋`;
  }

  if (!destinoId) {
    container.innerHTML = "<p>Destino no especificado.</p>";
    return;
  }

  try {
    const paquetes = await paquetesService.listarPorDestino(destinoId);

    if (paquetes.length === 0) {
      container.innerHTML = "<p>No hay paquetes disponibles para este destino.</p>";
      return;
    }

    paquetes.forEach(paquete => {
      const card = document.createElement("div");
      card.className = "paquete-card";

      if (!paquete.id) {
        console.warn("Paquete sin ID:", paquete);
        return;
      }


      card.innerHTML = `
        <h3>${paquete.nombre}</h3>
        <p><strong>Precio:</strong> $${paquete.precio}</p>
        <p><strong>Cupo:</strong> ${paquete.cupo}</p>
        <p><strong>Fechas:</strong> ${paquete.fecha_inicio} a ${paquete.fecha_fin}</p>
        <button onclick="mostrarFormulario(${paquete.id})">Reservar</button>
        <div id="formulario-${paquete.id}" class="reserva-formulario" style="display: none;">
          <label>Cantidad de personas:</label>
          <input type="number" id="cantidad-${paquete.id}" min="1" />
          <button onclick="confirmarReserva(${paquete.id})">Confirmar</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<p>Error al cargar paquetes: ${error.message}</p>`;
  }
});


window.mostrarFormulario = (paqueteId) => {
  document.getElementById(`formulario-${paqueteId}`).style.display = "block";
};


window.confirmarReserva = async (paqueteId) => {
  const cantidad = Number(document.getElementById(`cantidad-${paqueteId}`).value);
  
  if (!cantidad || cantidad <= 0) {
    alert("Por favor, ingresá una cantidad válida.");
    return;
  }

  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.id) {
    alert("No se pudo obtener el usuario. Por favor, inicia sesión nuevamente.");
    return;
  }

  const reserva = {
    usuario_id: usuario.id,
    paquete_id: Number(paqueteId),
    fecha_reserva: new Date().toISOString().slice(0, 10),
    cantidad_personas: Number(cantidad)
  };

  try {
    await reservasService.crear(reserva);
    alert("Reserva registrada correctamente.");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    window.location.href = "index.html";

  } catch (error) {
    alert("Error al registrar reserva: " + error.message);
  }
};