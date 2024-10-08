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
task-reminder-app/
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

## Instalación Local

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/usuario/task-reminder-app.git
   cd task-reminder-app
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
   Una vez desplegada, puedes acceder a la URL de App Engine que se te proporcionará al finalizar el despliegue (`https://your-app-id.appspot.com`).

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
