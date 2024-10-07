from google.cloud import firestore
from google.cloud import pubsub_v1
import datetime

def send_reminders(event, context):
    db = firestore.Client()
    tasks_ref = db.collection('tasks').where('reminder_time', '<=', datetime.datetime.now()).stream()
    for task in tasks_ref:
        task_data = task.to_dict()
        # Enviar notificación o reminder 
        print(f"Recordatorio para tarea: {task_data['title']}")
