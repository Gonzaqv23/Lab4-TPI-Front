const BASE_URL = "http://localhost:8000";

export const destinosService = {
  listar: async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("Token enviado:", token);
      const response = await fetch(`${BASE_URL}/destinos`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`

        }
      });

      if (!response.ok) throw new Error("No se pudieron obtener destinos");

      return await response.json(); // Array de destinos
    } catch (error) {
      console.error("Error al listar destinos:", error.message);
      throw error;
    }
  },

  obtenerPorId: async (id) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/destinos/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error("Destino no encontrado");
    return await response.json();
  }
};
