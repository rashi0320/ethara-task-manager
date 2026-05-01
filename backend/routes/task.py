from flask import Blueprint, request, jsonify
from models import db, Task
from flask_jwt_extended import jwt_required, get_jwt_identity

task_bp = Blueprint('task', __name__)

# CREATE
@task_bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        print("DATA:", data)
        print("USER:", user_id)

        title = data.get("title")
        project_id = data.get("project_id")

        if not title or not project_id:
            return {"msg": "Missing data"}, 400

        t = Task(
            title=title,
            project_id=int(project_id),
            assigned_to=int(user_id) if user_id else None,  # 🔥 FIX
            status="incomplete"
        )

        db.session.add(t)
        db.session.commit()

        return {"msg": "Task created"}

    except Exception as e:
        print("ERROR OCCURRED:", e)   # 🔥 terminal में दिखेगा
        return {"msg": "Server error"}, 500
    
    
    
# READ
@task_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    tasks = Task.query.all()

    return jsonify([{
    "id": t.id,
    "title": t.title,
    "status": t.status,
    "project_id": t.project_id   # 🔥 must be present
} for t in tasks])

# UPDATE
@task_bp.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    t = Task.query.get(id)

    if not t:
        return {"msg": "Task not found"}, 404

    t.status = request.json.get("status")
    db.session.commit()

    return {"msg": "Updated"}

# DELETE
@task_bp.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    t = Task.query.get(id)

    if not t:
        return {"msg": "Task not found"}, 404

    db.session.delete(t)
    db.session.commit()

    return {"msg": "Deleted"}