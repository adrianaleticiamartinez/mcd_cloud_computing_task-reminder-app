from flask import Flask, request, jsonify, render_template
from google.cloud import firestore
import datetime

app = Flask(__name__)
db = firestore.Client()

@app.route('/')
def index():
    """Renderiza el frontend de la aplicación."""
    return render_template('index.html')

@app.route('/tasks', methods=['POST'])
def create_task():
    """Endpoint para crear una nueva tarea"""
    task_data = request.json
    task_data['created_at'] = datetime.datetime.now()
    task_data['reminder_time'] = datetime.datetime.fromisoformat(task_data['reminder_time'])
    task_ref = db.collection('tasks').add(task_data)
    return jsonify({"success": True, "task_id": task_ref[1].id}), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    """Endpoint para obtener todas las tareas"""
    tasks = []
    tasks_ref = db.collection('tasks').stream()
    for task in tasks_ref:
        task_dict = task.to_dict()
        task_dict['id'] = task.id  # Guardamos el ID de la tarea para eliminarla después
        tasks.append(task_dict)
    return jsonify(tasks), 200

@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Endpoint para eliminar una tarea"""
    task_ref = db.collection('tasks').document(task_id)
    task_ref.delete()
    return jsonify({"success": True}), 200

