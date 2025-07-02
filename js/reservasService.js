const BASE_URL = "http://localhost:8000";

export const reservasService = {
  crear: async (reservaData) => {
    const token = sessionStorage.getItem("token");
    
    console.log("Reserva que se envía:", reservaData, typeof reservaData.paquete_id,
      typeof reservaData.cantidad_personas, reservaData.fecha_reserva);

    const res = await fetch(`${BASE_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(reservaData)
    });

    if (!res.ok) throw new Error("No se pudo registrar la reserva");
    return await res.json();
  },

  listar: async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/reservas`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error al obtener reservas");
    return await res.json();
  },

  obtenerPorId: async (id) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/reservas/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Reserva no encontrada");
    return await res.json();
  }
};
