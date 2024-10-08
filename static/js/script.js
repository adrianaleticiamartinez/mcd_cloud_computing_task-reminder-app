// Obtenemos los elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Event listener para agregar una tarea
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const reminderTime = document.getElementById('reminder-time').value;
    const email = document.getElementById('email').value;

    // Validar que el email sea válido usando una expresión regular
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("El correo electrónico no es válido");
        return;
    }

    // Validar que la fecha del recordatorio sea mayor a la fecha actual
    const currentDateTime = new Date();
    const reminderDateTime = new Date(reminderTime);
    if (reminderDateTime <= currentDateTime) {
        alert("La fecha de recordatorio debe ser mayor a la fecha actual");
        return;
    }

    // Hacemos una solicitud POST al backend para agregar una tarea
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title, 
            reminder_time: reminderTime,
            email 
        })
    });

    const result = await response.json();

    if (result.success) {
        loadTasks(); // Recargamos las tareas después de agregar una
        taskForm.reset(); // Limpiamos el formulario
    } else {
        alert("Error al agregar la tarea");
    }
});

// Función para obtener y mostrar las tareas
async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    taskList.innerHTML = ''; // Limpiamos la lista de tareas

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.title} - ${new Date(task.reminder_time).toLocaleString()} - ${task.email}</span>
            <button onclick="deleteTask('${task.id}')">Borrar</button>
        `;
        taskList.appendChild(li);
    });
}

// Función para eliminar una tarea
async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    });
    loadTasks(); // Recargamos las tareas después de eliminar una
}

// Cargar las tareas cuando se carga la página
window.onload = loadTasks;


