let db_alumnos = JSON.parse(localStorage.getItem('edu_alumnos')) || [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarTodo();

    document.getElementById('form-alumnos').onsubmit = (e) => {
        e.preventDefault();
        const nombre = document.getElementById('reg-nombre').value;
        const nota = parseFloat(document.getElementById('reg-nota').value);

        // Validación extra por seguridad
        if (nota < 1 || nota > 5) {
            alert("La nota debe estar entre 1 y 5");
            return;
        }

        db_alumnos.push({ nombre, nota });
        guardarDatos();
        e.target.reset();
        actualizarTodo();
    };
});

function guardarDatos() {
    localStorage.setItem('edu_alumnos', JSON.stringify(db_alumnos));
}

function actualizarTodo() {
    actualizarTablas();
    calcularEstadisticas();
    renderizarGrafico();
}

function actualizarTablas() {
    const html = db_alumnos.map((a, i) => `
        <tr>
            <td>${a.nombre}</td>
            <td class="text-center"><strong>${a.nota.toFixed(1)}</strong></td>
            <td class="no-print">
                <button onclick="eliminarAlumno(${i})" style="color:red; cursor:pointer; background:none; border:none;">Eliminar</button>
            </td>
        </tr>
    `).join('');
    document.getElementById('db-lista-alumnos').innerHTML = html;
}

function calcularEstadisticas() {
    if (db_alumnos.length === 0) {
        document.getElementById('val-promedio').textContent = "0.0";
        document.getElementById('val-mejor').textContent = "---";
        document.getElementById('val-peor').textContent = "---";
        return;
    }

    const suma = db_alumnos.reduce((acc, curr) => acc + curr.nota, 0);
    const promedio = suma / db_alumnos.length;

    let mejor = db_alumnos[0];
    let peor = db_alumnos[0];

    db_alumnos.forEach(a => {
        if (a.nota > mejor.nota) mejor = a;
        if (a.nota < peor.nota) peor = a;
    });

    document.getElementById('val-promedio').textContent = promedio.toFixed(2);
    document.getElementById('val-mejor').textContent = mejor.nombre;
    document.getElementById('val-peor').textContent = peor.nombre;
}

function renderizarGrafico() {
    const contenedor = document.getElementById('grafico-barras');
    contenedor.innerHTML = '';

    db_alumnos.forEach(a => {
        const columna = document.createElement('div');
        columna.className = 'columna-grafico';
        
        // Escala 1-5: multiplicamos por 20 para que 5 = 100% de la altura
        const porcentajeAltura = (a.nota * 20); 
        
        columna.innerHTML = `
            <div class="barra" style="height: ${porcentajeAltura}%">
                <span class="nota-label">${a.nota}</span>
            </div>
            <span class="nombre-label">${a.nombre}</span>
        `;
        contenedor.appendChild(columna);
    });
}

function eliminarAlumno(index) {
    if(confirm("¿Eliminar registro?")) {
        db_alumnos.splice(index, 1);
        guardarDatos();
        actualizarTodo();
    }
}

function nuevaSesion() {
    if(confirm("¿Limpiar todos los datos?")) {
        db_alumnos = [];
        guardarDatos();
        actualizarTodo();
    }
}

function imprimirDashboard() {
    window.print();
}