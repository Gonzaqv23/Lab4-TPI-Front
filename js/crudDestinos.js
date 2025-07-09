document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("token");
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const saludo = document.getElementById("adminSaludo");
    const tabla = document.getElementById("destinosTabla");
    const form = document.getElementById("destinoForm");

    const btnCrear = document.getElementById("btnCrear");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnEliminar = document.getElementById("btnEliminar");

    let destinoSeleccionadoId = null;

    if (usuario) {
    saludo.textContent = `Hola admin ${usuario.nombre} ${usuario.apellido} 👋`;
    }

    async function cargarDestinos() {
    try {
        const res = await fetch("http://localhost:8000/destinos", {
        headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("No se pudieron obtener los destinos");

        const data = await res.json();
        tabla.innerHTML = "";
        data.forEach(d => {
        tabla.innerHTML += `
            <tr data-id="${d.id}">
            <td>${d.nombre}</td>
            <td>${d.descripcion}</td>
            <td>${d.pais}</td>
            </tr>`;
        });

        document.querySelectorAll("#destinosTabla tr").forEach(row => {
        row.addEventListener("click", () => {
            const id = row.getAttribute("data-id");
            seleccionarDestino(id);
        });
        });

    } catch (err) {
        alert("Error: " + err.message);
    }
    }

    await cargarDestinos();

    async function seleccionarDestino(id) {
    try {
        const res = await fetch(`http://localhost:8000/destinos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Destino no encontrado");

        const destino = await res.json();

        document.getElementById("nombre").value = destino.nombre;
        document.getElementById("descripcion").value = destino.descripcion;
        document.getElementById("pais").value = destino.pais;

        destinoSeleccionadoId = id;

        btnCrear.style.display = "none";
        btnActualizar.style.display = "inline";
        btnEliminar.style.display = "inline";

    } catch (err) {
        alert("Error: " + err.message);
    }
    }

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (destinoSeleccionadoId) return;

    const nuevoDestino = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        pais: document.getElementById("pais").value
    };

    try {
        const res = await fetch("http://localhost:8000/destinos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevoDestino)
        });

        if (!res.ok) throw new Error("Error al crear destino");

        alert("Destino creado correctamente");
        form.reset();
        await cargarDestinos();
    } catch (err) {
        alert("Error: " + err.message);
    }
    });

    btnActualizar.addEventListener("click", async () => {
    if (!destinoSeleccionadoId) return;

    const destinoActualizado = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        pais: document.getElementById("pais").value
    };

    try {
        const res = await fetch(`http://localhost:8000/destinos/${destinoSeleccionadoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(destinoActualizado)
        });

        if (!res.ok) throw new Error("Error al actualizar");

        alert("Destino actualizado correctamente");
        limpiarFormulario();
        await cargarDestinos();
    } catch (err) {
        alert("Error: " + err.message);
    }
    });

    btnEliminar.addEventListener("click", async () => {
    if (!destinoSeleccionadoId) return;

    if (!confirm("¿Estás seguro de eliminar este destino?")) return;

    try {
        const res = await fetch(`http://localhost:8000/destinos/${destinoSeleccionadoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al eliminar");

        alert("Destino eliminado");
        limpiarFormulario();
        await cargarDestinos();
    } catch (err) {
        alert("Error: " + err.message);
    }
    });


    function limpiarFormulario() {
    form.reset();
    destinoSeleccionadoId = null;
    btnCrear.style.display = "inline";
    btnActualizar.style.display = "none";
    btnEliminar.style.display = "none";
    }
});