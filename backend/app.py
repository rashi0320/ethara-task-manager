from flask import Flask, render_template
from config import Config
from models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from routes.auth import auth_bp
from routes.project import project_bp
from routes.task import task_bp

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config.from_object(Config)

db.init_app(app)
JWTManager(app)
CORS(app)

@app.route("/")
def landing():
    return render_template("landing.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/signup")
def signup_page():
    return render_template("signup.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(project_bp, url_prefix="/api")
app.register_blueprint(task_bp, url_prefix="/api")

with app.app_context():
    db.create_all()

app.run(debug=True)