// Cargar las tareas desde el backend
async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";  // Limpiar la lista antes de agregar nuevas tareas

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = `${task.title} - Recordatorio: ${new Date(task.reminder_time).toLocaleString()} - Email: ${task.email}`;
        
        // Botón para eliminar tarea
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = async function() {
            await deleteTask(task.id);
            loadTasks();  // Volver a cargar la lista después de eliminar
        };

        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

// Eliminar una tarea por su ID
async function deleteTask(taskId) {
    const response = await fetch(`/tasks/${taskId}`, {
        method: "DELETE"
    });
    
    if (response.ok) {
        alert("Tarea eliminada correctamente");
    } else {
        alert("Error al eliminar la tarea");
    }
}

// Evento submit del formulario para crear una nueva tarea
document.getElementById("taskForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const reminder_time = document.getElementById("reminder_time").value;
    const email = document.getElementById("email").value;

    // Ocultar errores previos
    document.getElementById("timeError").style.display = "none";
    document.getElementById("emailError").style.display = "none";

    // Validar que la fecha del recordatorio sea mayor a la fecha actual
    const currentDateTime = new Date();
    const reminderDateTime = new Date(reminder_time);

    if (reminderDateTime <= currentDateTime) {
        document.getElementById("timeError").style.display = "block";
        return;
    }

    // Validar que el email sea válido usando una expresión regular
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("emailError").style.display = "block";
        return;
    }

    // Si todas las validaciones pasan, procede a crear la tarea
    const response = await fetch("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            reminder_time: reminder_time,
            email: email
        })
    });

    if (response.ok) {
        alert("Tarea creada correctamente");
        document.getElementById("taskForm").reset();
        loadTasks();  // Vuelve a cargar las tareas después de crear una nueva
    } else {
        alert("Error al crear la tarea");
    }
});

// Cargar las tareas al cargar la página
loadTasks();

// Cargar las tareas cuando se carga la página
window.onload = loadTasks;
