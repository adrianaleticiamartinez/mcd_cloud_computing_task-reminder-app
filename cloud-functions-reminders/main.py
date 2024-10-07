import json
from google.cloud import firestore

def send_reminder(request):
    db = firestore.Client()
    users_ref = db.collection('users')
    users = users_ref.stream()

    reminders = []
    for user in users:
        reminders.append(f"Send reminder to {user.id}")
    
    return json.dumps(reminders)
