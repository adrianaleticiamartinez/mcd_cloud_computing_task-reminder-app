from google.cloud import firestore
from google.cloud import pubsub_v1
import datetime
import base64
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText

# Remitente del correo
SENDER_EMAIL = '0268379@up.edu.mx'  

# Cargar las credenciales de la API de Gmail
def get_gmail_service():
    creds = None
    # Cargar credenciales guardadas
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', ['https://www.googleapis.com/auth/gmail.send'])
    # Si no hay credenciales válidas disponibles, pedir autenticación
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            raise Exception("Error: No Gmail API credentials found")
    # Construir el servicio de la API de Gmail
    service = build('gmail', 'v1', credentials=creds)
    return service

# Enviar email usando Gmail API
def send_email(to, subject, body):
    service = get_gmail_service()
    message = MIMEText(body)
    message['to'] = to
    message['from'] = SENDER_EMAIL  # Especificar el remitente
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    message_body = {'raw': raw_message}
    
    service.users().messages().send(userId="me", body=message_body).execute()

# Función principal que verifica los recordatorios y envía emails
def send_reminders(event, context):
    db = firestore.Client()
    # Obtener tareas cuyo recordatorio es igual o anterior al momento actual
    tasks_ref = db.collection('tasks').where('reminder_time', '<=', datetime.datetime.now()).stream()

    for task in tasks_ref:
        task_data = task.to_dict()

        # Extraer el correo electrónico del recordatorio
        email = task_data.get('email')
        if not email:
            print(f"Tarea sin email asignado: {task_data['title']}")
            continue
        
        # Título de la tarea
        title = task_data.get('title', 'Sin título')

        # Enviar correo electrónico al usuario
        subject = f"Recordatorio para tu tarea: {title}"
        body = f"Este es un recordatorio para la tarea: {title}. ¡No lo olvides!"
        send_email(email, subject, body)

        # Imprimir en consola que se ha enviado el recordatorio
        print(f"Recordatorio enviado para la tarea: {title} al correo {email}")


