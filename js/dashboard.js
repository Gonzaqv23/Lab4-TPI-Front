document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("token");
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));

  const saludo = document.getElementById("adminSaludo");
  const statsContainer = document.getElementById("estadisticasContainer");

  if (usuario) {
    saludo.textContent = `Hola admin ${usuario.nombre} ${usuario.apellido} 👋`;
  }

  try {
    const res = await fetch("http://localhost:8000/dashboard/admin", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Error al obtener estadísticas");

    const data = await res.json();

    statsContainer.innerHTML = `
      <p><strong>Destinos cargados:</strong> ${data.total_destinos}</p>
      <p><strong>Reservas activas:</strong> ${data.reservas_activas}</p>
      <p><strong>Paquete más reservado:</strong> ${data.paquete_mas_reservado?.nombre || "No hay datos"}</p>
      <p><strong>Top usuarios:</strong></p>
      <ul>
        ${data.usuarios_destacados.map(u => `<li>${u.nombre} ${u.apellido} (${u.total_reservas} reservas)</li>`).join("")}
      </ul>
    `;
  } catch (err) {
    statsContainer.innerHTML = `<p>Error al cargar estadísticas: ${err.message}</p>`;
  }

  // CRUD Botones
  document.getElementById("btnUsuarios").addEventListener("click", () => {
    window.location.href = "crudUsuarios.html";
  });

  document.getElementById("btnDestinos").addEventListener("click", () => {
    window.location.href = "crudDestinos.html";
  });

  document.getElementById("btnPaquetes").addEventListener("click", () => {
    window.location.href = "crudPaquetes.html";
  });
});