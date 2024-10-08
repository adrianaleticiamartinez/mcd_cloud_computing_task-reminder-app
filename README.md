# mcd_cloud_computing_task-reminder-app
 Proyecto final de la asignatura cloud computing de la maestria en ciencia de datos de la Universidad Panamericana
 Alumno: Adriana  Martinez 

# Task Reminder App

## Descripción

**Task Reminder App** es una aplicación web diseñada para crear y gestionar tareas con recordatorios automáticos. La aplicación permite que los usuarios configuren tareas con fechas y horas de recordatorio, y recibe notificaciones por correo electrónico cuando es momento de realizar la tarea. La aplicación está desplegada en **Google Cloud Platform (GCP)**, utilizando varios de sus servicios como App Engine, Firestore, Cloud Functions, y la API de Gmail.

## Características

- Crear, listar y eliminar tareas con recordatorios.
- Enviar correos electrónicos automáticos cuando una tarea está por vencerse.
- Interfaz web amigable.
- Escalable y seguro, desplegado en **Google App Engine**.
- Integración con **Google Cloud Firestore** como base de datos NoSQL para almacenar las tareas.
- Uso de **Cloud Functions** para manejar las notificaciones por correo electrónico.

## Arquitectura

La aplicación está construida con los siguientes componentes de GCP:

- **Google App Engine**: Hospeda la aplicación web y gestiona el backend.
- **Google Cloud Firestore**: Almacena las tareas y sus detalles.
- **Google Cloud Functions**: Envía los recordatorios de las tareas a los usuarios.
- **Gmail API**: Envía los correos electrónicos con los recordatorios.
- **Google Cloud Pub/Sub**: Se utiliza para desencadenar los eventos de notificación.

## Estructura del Proyecto

```
mcd_cloud_computing_task-reminder-app/
│
├─── main.py                # Código del backend con Flask
├─── app.yaml               # Configuración de App Engine para el despliegue
├─── requirements.txt       # Dependencias del backend
│
├─── static/                # Recursos estáticos (frontend)
│   ├─── css/
│   │   └─── styles.css     # Estilos CSS de la aplicación
│   ├─── js/
│   │   └─── script.js      # Lógica del frontend con JavaScript
│
├─── templates/             # Plantillas HTML
│   └─── index.html         # Página principal del frontend
│
├─── cloud-functions-reminders/    # Función en Cloud Functions para enviar recordatorios
│   ├─── main.py                     # Código de la función
│   └─── requirements.txt            # Dependencias necesarias para la función
```

## Detalle del Código

### Backend - `main.py`

Este archivo maneja la lógica principal del backend, implementado con Flask:

- **Flask** es el framework que gestiona las rutas y el servidor.
- **Firestore** se utiliza como la base de datos para almacenar las tareas.
  
1. **Rutas principales:**

   - `/`: Carga la página principal con el frontend (HTML).
   - `/tasks` (POST): Crea una nueva tarea con título, hora de recordatorio y correo electrónico.
   - `/tasks` (GET): Lista todas las tareas almacenadas en Firestore.
   - `/tasks/<task_id>` (DELETE): Elimina una tarea por su ID.

2. **Validaciones clave:**

   - El servidor valida que el campo `email` sea proporcionado.
   - El formato de la hora de recordatorio se transforma a UTC, y se valida que esté correctamente formateado.

### Frontend - `static/js/script.js`

Este archivo contiene la lógica del frontend en JavaScript, incluyendo la interacción con el servidor a través de peticiones **fetch**.

1. **Cargar tareas:** Llama a la API para obtener todas las tareas y las muestra en la página.
2. **Crear una nueva tarea:** Envía una petición POST al servidor para crear una tarea, validando el correo y la fecha antes de enviarla.
3. **Eliminar una tarea:** Envía una petición DELETE al servidor para eliminar la tarea seleccionada.


### Cloud Functions - `cloud-functions-reminders/main.py`

Esta función se ejecuta en segundo plano y verifica las tareas que están por vencerse. Si una tarea está próxima a su hora de recordatorio, se envía un correo electrónico utilizando la API de Gmail.

1. **Firestore:** Consulta las tareas con `reminder_time` menor o igual al tiempo actual.
2. **Gmail API:** Envía un correo de recordatorio utilizando las credenciales de OAuth.



### Estilos y Estructura del Frontend

- **index.html**: Estructura HTML de la página principal.
- **styles.css**: Define los estilos de la aplicación, mejorando la presentación de la lista de tareas y el formulario.
- **script.js**: Interactúa con el backend para cargar y gestionar las tareas.

## Instalación Local

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/adrianaleticiamartinez/mcd_cloud_computing_task-reminder-app.git
   cd mcd_cloud_computing_task-reminder-app
   ```

2. **Configura un entorno virtual e instala las dependencias:**

   ```bash
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```

3. **Inicia la aplicación localmente:**

   ```bash
   flask run
   ```

   La aplicación estará disponible en `http://localhost:5000`.

## Despliegue en Google Cloud

1. **Configura tu proyecto de GCP:**

   - Asegúrate de haber creado un proyecto en Google Cloud y de haber activado los servicios de App Engine y Firestore.

2. **Despliega el backend en App Engine:**

   ```bash
   gcloud app deploy
   ```

3. **Despliega la función de recordatorios en Cloud Functions:**

   Ve al directorio `cloud-functions-reminders/` y ejecuta:

   ```bash
   gcloud functions deploy send_reminders \
   --runtime python310 \
   --trigger-topic=your-topic-name \
   --set-env-vars "GCP_PROJECT_ID=your-project-id" \
   --entry-point send_reminders
   ```

4. **Configura Firestore:**

   - Accede a la consola de GCP, activa Firestore y selecciona el modo "Nativo".
   - No es necesario configurar un nombre específico para la base de datos, ya que Firestore toma `default` como base.

5. **Configura la API de Gmail:**

   - Habilita la **Gmail API** desde la consola de GCP.
   - Crea credenciales de OAuth2 para autorizar el envío de correos.

## Uso

1. **Acceder a la aplicación:**
   Una vez desplegada, puedes acceder a la URL de App Engine que se te proporcionará al finalizar el despliegue

2. **Crear tareas:**
   - Ingresa un título, la fecha y hora del recordatorio, y el correo electrónico.
   - Valida que la fecha del recordatorio sea mayor a la actual y que el correo sea válido.
   
3. **Recibir notificaciones:**
   - La aplicación enviará automáticamente correos electrónicos al correo ingresado cuando la tarea esté por vencer.

## Contribuir

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un **fork** del repositorio.
2. Crea una nueva **rama** (`git checkout -b feature/nueva-caracteristica`).
3. Haz tus **cambios** y realiza un **commit** (`git commit -m 'Añadir nueva característica'`).
4. Haz un **push** a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un **pull request**.

