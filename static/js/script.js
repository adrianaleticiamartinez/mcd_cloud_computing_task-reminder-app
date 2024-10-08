// Función para cargar las tareas desde el backend
async function loadTasks() {
    try {
        const response = await fetch("/tasks");
        const tasks = await response.json();

        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";  // Limpiar la lista antes de agregar nuevas tareas

        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${task.title} - Recordatorio: ${new Date(task.reminder_time).toLocaleString()} - Email: ${task.email}</span>
                <button class="delete-button">Eliminar</button>
            `;

            // Botón para eliminar tarea
            const deleteButton = listItem.querySelector(".delete-button");
            deleteButton.onclick = async function() {
                await deleteTask(task.id);
                loadTasks();  // Volver a cargar la lista después de eliminar
            };

            taskList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
        showMessage("Error al cargar las tareas", "error");
    }
}

// Función para eliminar una tarea por su ID
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: "DELETE"
        });
        
        if (response.ok) {
            showMessage("Tarea eliminada correctamente", "success");
        } else {
            showMessage("Error al eliminar la tarea", "error");
        }
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        showMessage("Error al eliminar la tarea", "error");
    }
}

// Evento submit del formulario para crear una nueva tarea
document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("taskForm");

    taskForm.addEventListener("submit", async function(event) {
        event.preventDefault();  // Evita que la página se recargue al enviar el formulario

        const title = document.getElementById("title").value;
        const reminder_time = document.getElementById("reminder_time").value;
        const email = document.getElementById("email").value;

        // Ocultar errores previos
        clearMessages();

        // Validar que la fecha del recordatorio sea mayor a la fecha actual
        const currentDateTime = new Date();
        const reminderDateTime = new Date(reminder_time);

        if (reminderDateTime <= currentDateTime) {
            showMessage("La fecha de recordatorio debe ser mayor a la fecha actual", "error");
            return;
        }

        // Validar que el email sea válido usando una expresión regular
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showMessage("El correo electrónico no es válido", "error");
            return;
        }

        // Si todas las validaciones pasan, procede a crear la tarea
        try {
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
                showMessage("Tarea creada correctamente", "success");
                taskForm.reset();
                loadTasks();  // Vuelve a cargar las tareas después de crear una nueva
            } else {
                const errorData = await response.json();
                showMessage(`Error: ${errorData.error}`, "error");
            }
        } catch (error) {
            console.error("Error al crear la tarea:", error);
            showMessage("Error al crear la tarea", "error");
        }
    });

    // Cargar las tareas cuando se carga la página
    loadTasks();
});

// Función para mostrar mensajes de éxito o error
function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type; // Aplica clases CSS para estilo según el tipo de mensaje ('success' o 'error')
    messageDiv.style.display = "block";  // Mostrar mensaje
}

// Función para limpiar mensajes
function clearMessages() {
    const messageDiv = document.getElementById("message");
    messageDiv.style.display = "none";
    messageDiv.textContent = "";
}

// Cargar las tareas cuando se carga la página
window.onload = loadTasks;

