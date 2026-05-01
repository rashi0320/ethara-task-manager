from flask import Blueprint, request, jsonify
from models import db, Project
from flask_jwt_extended import jwt_required, get_jwt_identity

project_bp = Blueprint('project', __name__)

@project_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    user = get_jwt_identity()

    name = request.json.get("name")

    if not name:
        return {"msg": "Project name required"}, 400

    p = Project(
        name=name,
        created_by=int(user)   # 🔥 important
    )

    db.session.add(p)
    db.session.commit()

    return {"msg": "Project created"}



@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    projects = Project.query.all()

    return jsonify([
        {"id": p.id, "name": p.name}
        for p in projects
    ])


# UPDATE PROJECT
@project_bp.route('/projects/<int:id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    p = Project.query.get(id)

    if not p:
        return {"msg": "Project not found"}, 404

    name = request.json.get("name")

    if not name:
        return {"msg": "Name required"}, 400

    p.name = name
    db.session.commit()

    return {"msg": "Project updated"}


# DELETE PROJECT
@project_bp.route('/projects/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):
    p = Project.query.get(id)

    if not p:
        return {"msg": "Project not found"}, 404

    db.session.delete(p)
    db.session.commit()

    return {"msg": "Project deleted"}