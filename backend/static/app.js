let role = "member";

// ================= ROLE =================
function setRole(r, el){
    role = r;

    document.querySelectorAll(".role-btn").forEach(btn=>{
        btn.classList.remove("active");
    });

    el.classList.add("active");

    console.log("Role selected:", role); // debug
}

// ================= PASSWORD TOGGLE =================
function togglePassword(id){
    let field = document.getElementById(id);

    if(field.type === "password"){
        field.type = "text";
    } else {
        field.type = "password";
    }
}

// ================= LOGIN =================
function login(){

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(!username || !password){
        alert("Fill all fields");
        return;
    }
    console.log(username, password, role);

    fetch("/api/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
        username: username,
        password: password,
        role: role   // 🔥 MUST

        })
    })
    .then(r=>r.json())
    .then(d=>{
    if(d.token){

        localStorage.setItem("token", d.token);

        // 🔥 FORCE SAVE ROLE (temporary fix)
        localStorage.setItem("role", role);

        window.location="/dashboard";

    } else {
        alert(d.msg);
    }
});pyt
}

// ================= SIGNUP =================
function signup(){
    console.log("SIGNUP CLICKED");
    let username = document.getElementById("suser").value;
    let password = document.getElementById("spass").value;

    console.log(username, password, role);

    if(!username || !password){
        alert("Fill all fields");
        return;
    }

    if(!/[0-9]/.test(password)){
        alert("Password must contain number");
        return;
    }
    fetch("/api/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password,role})
    })
    .then(r=>r.json())
    .then(d=>{
        alert(d.msg);

        if(d.msg==="User created"){
            window.location="/login";
        }
    });
}

window.onload = () => {
    let u = document.getElementById("username");
    let p = document.getElementById("password");
    let su = document.getElementById("suser");
    let sp = document.getElementById("spass");

    if(u) u.value="";
    if(p) p.value="";
    if(su) su.value="";
    if(sp) sp.value="";
};



function createProject(){

    let name = document.getElementById("projectName").value;

    if(!name){
        alert("Enter project name");
        return;
    }

    fetch("/api/projects",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body:JSON.stringify({name: name})
    })
    .then(res => res.json())
    .then(data => {

        console.log("Response:", data);

        if(data.msg === "Project created"){
            alert("Project created ✅");

            document.getElementById("projectName").value = "";
            loadProjects();
        } else {
            alert(data.msg || "Something went wrong");
        }

    })
    .catch(err => {
        console.error("Error:", err);
        // ❌ remove duplicate alert
    });
}




function loadProjects(){

    fetch("/api/projects",{
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(projects => {

        let container = document.getElementById("projectsContainer");
        container.innerHTML = "";

        projects.forEach(p => {

            let div = document.createElement("div");
            div.className = "project-box";

            div.innerHTML = `
                <h3>${p.name}</h3>

                <button onclick="editProject(${p.id})">✏️ Update</button>
                <button onclick="deleteProject(${p.id})">🗑 Delete</button>

                <div style="margin-top:10px;">
                    <input id="task-${p.id}" placeholder="Add task">
                    <button onclick="createTask(${p.id})">Add</button>
                </div>

                <div id="tasks-${p.id}"></div>
            `;

            container.appendChild(div);

            loadTasks(p.id); // 🔥 important
        });
    })
    .catch(err => console.error(err));
}



function createTask(projectId){

    console.log("CLICKED ADD TASK", projectId); // 🔥 debug

    let input = document.getElementById("task-"+projectId);

    if(!input){
        alert("Input not found ❌");
        return;
    }

    let title = input.value.trim();

    if(!title){
        alert("Enter task name");
        return;
    }

    fetch("/api/tasks",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body:JSON.stringify({
            title: title,
            project_id: Number(projectId)
        })
    })
    .then(res => res.json())
    .then(data => {

        console.log("API RESPONSE:", data); // 🔥 debug

        if(data.msg === "Task created"){
            alert("Task created ✅");
            input.value = "";
            loadProjects();
        } else {
            alert(data.msg || "Task failed");
        }
    })
    .catch(err => {
        console.error("ERROR:", err);
        alert("Server error ❌");
    });
}


function loadTasks(projectId){

    fetch("/api/tasks",{
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token")
        }
    })
    .then(res=>res.json())
    .then(tasks=>{
        

        let div = document.getElementById("tasks-"+projectId);
        div.innerHTML = "";

        let total = 0;
        let completed = 0;
        let overdue = 0;

        tasks.forEach(t=>{

            if(Number(t.project_id) === Number(projectId)){

                total++;

                if(t.status === "completed"){
                    completed++;
                } else {
                    overdue++;
                }

                let color = t.status === "completed" ? "green" : "red";

                div.innerHTML += `
                <div style="margin-top:5px; color:${color}">
                    ${t.title} (${t.status})

                    <button onclick="completeTask(${t.id})">✔</button>
                    <button onclick="incompleteTask(${t.id})">✖</button>
                    <button onclick="deleteTask(${t.id})">🗑</button>
                </div>
                `;
            }
        });

        // 🔥 👉 यहीं लिखना है (loop के बाद)

        let percent = total ? Math.round((completed / total) * 100) : 0;

        document.getElementById("progress").innerText =
            "Progress: " + percent + "%";

        document.getElementById("overdue").innerText =
            "Pending: " + overdue;
    });
}




function completeTask(id){
    fetch("/api/tasks/"+id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body:JSON.stringify({status:"completed"})
    })
    .then(res=>res.json())
    .then(data=>{
        console.log("UPDATE:", data);
        loadProjects();
    })
    .catch(err=>console.error(err));
}

function incompleteTask(id){
    fetch("/api/tasks/"+id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body:JSON.stringify({status:"incomplete"})
    })
    .then(res=>res.json())
    .then(data=>{
        console.log("UPDATE:", data);
        loadProjects();
    })
    .catch(err=>console.error(err));
}



function deleteTask(id){
    fetch("/api/tasks/"+id,{
        method:"DELETE",
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token")
        }
    })
    .then(res=>res.json())
    .then(data=>{
        console.log("DELETE:", data);
        loadProjects();
    })
    .catch(err=>console.error(err));
}




function deleteProject(id){

    if(!confirm("Delete this project?")) return;

    fetch("/api/projects/"+id,{
        method:"DELETE",
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token")
        }
    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.msg);
        loadProjects();
    })
    .catch(err=>console.error(err));
}


function editProject(id){

    let newName = prompt("Enter new project name:");

    if(!newName){
        alert("Name required");
        return;
    }

    fetch("/api/projects/"+id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body:JSON.stringify({name:newName})
    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.msg);
        loadProjects();
    })
    .catch(err=>console.error(err));
}




function toggleAccount(){
    let box = document.getElementById("accountBox");

    if(box.style.display === "none"){
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}