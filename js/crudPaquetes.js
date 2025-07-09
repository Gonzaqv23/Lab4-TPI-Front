document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("token");
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const saludo = document.getElementById("adminSaludo");
    const tabla = document.getElementById("paquetesTabla");
    const form = document.getElementById("crudForm");

    const btnCrear = document.getElementById("btnCrear");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnEliminar = document.getElementById("btnEliminar");

    let paqueteSeleccionadoId = null;

    if (usuario) {
    saludo.textContent = `Hola admin ${usuario.nombre} ${usuario.apellido} 👋`;
    }

    async function cargarDestinosEnSelect() {
    const select = document.getElementById("destino_id");
    try {
        const response = await fetch("http://localhost:8000/destinos", {
        headers: { Authorization: `Bearer ${token}` }
        });
        const destinos = await response.json();

        destinos.forEach(destino => {
        const option = document.createElement("option");
        option.value = destino.id;
        option.textContent = destino.nombre;
        select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar destinos:", error);
    }
    }

    async function cargarPaquetes() {
    try {
        const res = await fetch("http://localhost:8000/paquetes", {
        headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("No se pudieron obtener paquetes");

        const data = await res.json();
        tabla.innerHTML = "";
        data.forEach(p => {
        tabla.innerHTML += `
            <tr data-id="${p.id}">
            <td>${p.destino_id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.cupo}</td>
            <td>${p.fecha_inicio}</td>
            <td>${p.fecha_fin}</td>
            </tr>`;
        });

        console.log(data);
        console.log(data[0]);

        document.querySelectorAll("#paquetesTabla tr").forEach(row => {
        row.addEventListener("click", () => {
            const id = row.getAttribute("data-id");
            seleccionarPaquete(id);
        });
        });
    } catch (err) {
        alert("Error: " + err.message);
    }
    }

    async function seleccionarPaquete(id) {
    try {
        const res = await fetch(`http://localhost:8000/paquetes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Paquete no encontrado");

        const paquete = await res.json();

        document.getElementById("destino_id").value = paquete.destino_id;
        document.getElementById("nombre").value = paquete.nombre;
        document.getElementById("precio").value = paquete.precio;
        document.getElementById("cupo").value = paquete.cupo;
        document.getElementById("fecha_inicio").value = paquete.fecha_inicio;
        document.getElementById("fecha_fin").value = paquete.fecha_fin;

        paqueteSeleccionadoId = id;

        btnCrear.style.display = "none";
        btnActualizar.style.display = "inline";
        btnEliminar.style.display = "inline";
    } catch (err) {
        alert("Error: " + err.message);
    }
    }

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (paqueteSeleccionadoId) return;

    const nuevoPaquete = {
        destino_id: Number(document.getElementById("destino_id").value),
        nombre: document.getElementById("nombre").value,
        precio: parseFloat(document.getElementById("precio").value),
        cupo: parseInt(document.getElementById("cupo").value),
        fecha_inicio: document.getElementById("fecha_inicio").value,
        fecha_fin: document.getElementById("fecha_fin").value
    };

    try {
        const res = await fetch("http://localhost:8000/paquetes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevoPaquete)
        });

        if (!res.ok) throw new Error("Error al crear paquete");

        alert("Paquete creado correctamente");
        form.reset();
        await cargarPaquetes();
    } catch (err) {
        alert("Error: " + err.message);
    }
    });

    btnActualizar.addEventListener("click", async () => {
    if (!paqueteSeleccionadoId) return;

    const paqueteActualizado = {
        destino_id: Number(document.getElementById("destino_id").value),
        nombre: document.getElementById("nombre").value,
        precio: parseFloat(document.getElementById("precio").value),
        cupo: parseInt(document.getElementById("cupo").value),
        fecha_inicio: document.getElementById("fecha_inicio").value,
        fecha_fin: document.getElementById("fecha_fin").value
    };

    try {
        const res = await fetch(`http://localhost:8000/paquetes/${paqueteSeleccionadoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paqueteActualizado)
        });

        if (!res.ok) throw new Error("Error al actualizar paquete");

        alert("Paquete actualizado correctamente");
        limpiarFormulario();
        await cargarPaquetes();
    } catch (err) {
        alert("Error: " + err.message);
    }
    });

    btnEliminar.addEventListener("click", async () => {
    if (!paqueteSeleccionadoId) return;

    if (!confirm("¿Estás seguro de eliminar este paquete?")) return;

    try {
        const res = await fetch(`http://localhost:8000/paquetes/${paqueteSeleccionadoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al eliminar paquete");

        alert("Paquete eliminado");
        limpiarFormulario();
        await cargarPaquetes();
    } catch (err) {
        alert("Error: " + err.message);
    }
    });

    function limpiarFormulario() {
    form.reset();
    paqueteSeleccionadoId = null;
    btnCrear.style.display = "inline";
    btnActualizar.style.display = "none";
    btnEliminar.style.display = "none";
    }

    await cargarDestinosEnSelect();
    await cargarPaquetes();
});