# 🚀 Team Task Manager (Full-Stack)

A web-based Task Management System where users can create projects, assign tasks, and track progress with role-based access control (Admin/Member).

---

## 📌 Features

* 🔐 **Authentication**

  * Signup & Login
  * Role-based access (Admin / Member)

* 📁 **Project Management**

  * Create, update, delete projects
  * View all projects in dashboard

* ✅ **Task Management**

  * Add tasks inside projects
  * Mark tasks as Completed / Incomplete
  * Delete tasks
  * Full CRUD operations

* 📊 **Dashboard**

  * View all projects and tasks
  * Progress tracking (% completed)
  * Pending tasks count

* 👤 **Role-Based System**

  * Same username allowed with different roles
  * Admin & Member login handled separately

---

## 🛠️ Tech Stack

* **Backend:** Flask (Python)
* **Frontend:** HTML, CSS, JavaScript
* **Database:** SQLite
* **Authentication:** JWT (Flask-JWT-Extended)
* **Deployment:** Railway

---

## 📂 Project Structure

```
backend/
│── app.py
│── models.py
│── config.py
│── routes/
│     ├── auth.py
│     ├── project.py
│     └── task.py
│
├── templates/
│     ├── login.html
│     ├── signup.html
│     └── dashboard.html
│
├── static/
│     ├── app.js
│     └── style.css
│
└── requirements.txt
```

---

## ⚙️ Setup Instructions (Local Run)

1. Clone the repository:

```
git clone https://github.com/your-username/ethara-task-manager.git
cd ethara-task-manager
```

2. Install dependencies:

```
pip install -r requirements.txt
```

3. Run the application:

```
python app.py
```

4. Open browser:

```
http://localhost:5000
```

---

## 🌐 Live Deployment

👉 Hosted on Railway
🔗 Live URL: *(Add your Railway link here)*

---

## 🔐 Authentication Flow

* User selects role (Admin / Member) during signup
* Same username allowed with different roles
* Login only succeeds if:

  * Username ✔
  * Password ✔
  * Role ✔

---

## 📊 Dashboard Details

* Displays:

  * User Role (Admin / Member)
  * Project list
  * Task list
  * Progress %
  * Pending tasks

---

## 📦 API Overview

### Auth

* `POST /signup`
* `POST /login`

### Projects

* `POST /projects`
* `GET /projects`
* `PUT /projects/<id>`
* `DELETE /projects/<id>`

### Tasks

* `POST /tasks`
* `GET /tasks`
* `PUT /tasks/<id>`
* `DELETE /tasks/<id>`

---

## 🎥 Demo Video

👉 *(Add your demo video link or file here)*

---

## 📌 Future Improvements

* User profile page
* Task assignment to specific users
* Notifications
* Better UI/UX
* Role-based dashboard views

---

## 👩‍💻 Author

**Rashi Mishra**

---

## 💯 Status

✅ Fully Functional
✅ Role-Based System
✅ CRUD Operations Working
✅ Ready for Deployment

---
