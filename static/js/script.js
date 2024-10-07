// Obtenemos los elementos del DOM
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Event listener para agregar una tarea
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const reminderTime = document.getElementById('reminder-time').value;

    // Hacemos una solicitud POST al backend para agregar una tarea
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, reminder_time: reminderTime })
    });

    const result = await response.json();

    if (result.success) {
        loadTasks(); // Recargamos las tareas después de agregar una
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
            <span>${task.title} - ${new Date(task.reminder_time).toLocaleString()}</span>
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
