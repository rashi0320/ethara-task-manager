from flask import Blueprint, request
from models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# ================= SIGNUP =================
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # username unique    
    # username + role unique check
    if User.query.filter_by(
        username=data.get("username"),
        role=data.get("role")
    ).first():
       return {"msg": "User already exists with this role"}, 400

    # password validation
    if not any(c.isdigit() for c in data.get("password", "")):
        return {"msg": "Password must contain number"}, 400

    hashed = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

    user = User(
        username=data["username"],
        password=hashed,
        role=data.get("role", "member")
    )

    db.session.add(user)
    db.session.commit()

    return {"msg": "User created"}


# ================= LOGIN =================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # पहले user find करो (username + role)
    user = User.query.filter_by(
        username=data["username"],
        role=data["role"]
    ).first()

    if not user:
        return {"msg": "No user exist"}, 401

    # 🔥 password check (IMPORTANT FIX)
    if not bcrypt.check_password_hash(user.password, data["password"]):
        return {"msg": "Invalid password"}, 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return {
    "token": token,
    "role": user.role   # 🔥 ADD THIS LINE
}
