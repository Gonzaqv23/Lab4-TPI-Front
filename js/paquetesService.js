const BASE_URL = "http://localhost:8000";

export const paquetesService = {
  listar: async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/paquetes`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("No se pudieron obtener paquetes");
    return await res.json();
  },

  obtenerPorId: async (id) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/paquetes/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Paquete no encontrado");
    return await res.json();
  },

  listarPorDestino: async (destinoId) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/destinos/${destinoId}/paquetes`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("No se pudieron obtener los paquetes por destino");
    return await res.json();
  }
};
