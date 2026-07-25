console.log("SCRIPT LOADED");
const role = document.body.dataset.role;
let editingCandidate = false;
let editingCandidateAdmission = "";
// ================================
// Sidebar Toggle
// ================================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.onclick = function () {

    sidebar.classList.toggle("collapsed");

};


// ================================
// Live Clock
// ================================

function updateClock(){

    const now = new Date();

    const time = now.toLocaleTimeString();

    document.getElementById("clock").innerHTML = time;

}

setInterval(updateClock,1000);

updateClock();


// ================================
// Full Screen
// ================================

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.onclick = function(){

    if(!document.fullscreenElement){

        document.documentElement.requestFullscreen();

    }

    else{

        document.exitFullscreen();

    }

};


// ================================
// Logout
// ================================

document.getElementById("logoutBtn").onclick=function(){

    if(confirm("Do you want to logout?")){

        window.location.href="/";

    }

};

// ===============================
// Page Navigation
// ===============================

function showPage(page){

    let content = document.getElementById("content-area");

    if(page=="dashboard"){

    content.innerHTML = `

    <h1>Dashboard</h1>

    <div class="cards">

        <div class="card">
            <h3>Total Students</h3>
            <h1 id="totalStudents">0</h1>
        </div>

        <div class="card">
            <h3>Total Candidates</h3>
            <h1 id="totalCandidates">0</h1>
        </div>

        <div class="card">
            <h3>Votes Cast</h3>
            <h1 id="totalVotes">0</h1>
        </div>

        <div class="card">
            <h3>Election Status</h3>
            <h1 id="electionStatus">Not Started</h1>
        </div>

    </div>

    `;

    loadDashboard();

}
if(page=="registration"){

content.innerHTML = `

<h1>Registration Center</h1>

<div class="registration-wrapper">

    <!-- Student Card -->

    <div class="registration-card">

        <h2>Student Registration</h2>

        <div class="form-box">

            <label>Admission Number</label>
            <input type="text" id="admission" placeholder="Enter Admission Number">

            <label>Student Name</label>
            <input type="text" id="studentName" placeholder="Enter Student Name">

            <label>Class</label>
            <select id="class">
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
            </select>

            <label>Section</label>
            <input type="text" id="section" placeholder="Enter Section">

            <label>House</label>

            <select id="house">
                <option>Spring</option>
                <option>Summer</option>
                <option>Winter</option>
            </select>

            <label>Attendance</label>

            <select id="attendance">
                <option>Present</option>
                <option>Absent</option>
            </select>

            <br><br>

            <button id="saveBtn">Save Student</button>

            <button id="updateBtn" style="display:none;">
                Update Student
            </button>

            <button id="clearBtn">Clear</button>

        </div>

    </div>

    <!-- Candidate Card -->

    <div class="registration-card">

        <h2>Candidate Registration</h2>

        <div class="form-box">

            <label>Admission Number</label>

            <input type="text" id="candidateAdmission">

            <button id="fetchStudentBtn">

                Fetch Student

            </button>

            <label>Candidate Name</label>

            <input type="text" id="candidateName" readonly>

            <label>Class</label>

            <input type="text" id="candidateClass" readonly>

            <label>Section</label>

            <input type="text" id="candidateSection" readonly>

            <label>House</label>

            <select id="candidateHouse" disabled>

                <option>Spring</option>
                <option>Summer</option>
                <option>Winter</option>

            </select>

            <label>Position</label>

            <select id="candidatePosition">

                <option>School Captain</option>
                <option>Vice Captain</option>
                <option>Sports Captain</option>
                <option>Cultural Secretary</option>

            </select>
            
            <label>Candidate Photo</label>

<input
type="file"
id="candidatePhoto"
accept=".jpg,.jpeg,.png">

<br><br>

<img
id="photoPreview"
src="/static/images/default.png"
style="
width:150px;
height:180px;
border:2px solid #ccc;
border-radius:8px;
object-fit:cover;">

            <br><br>

            <button id="saveCandidateBtn">

                Save Candidate

            </button>

            <button id="clearCandidateBtn">

                Clear

            </button>

        </div>

    </div>

</div>

`;

}

if(page=="students"){

content.innerHTML = `



<h1>Student Management</h1>

<div class="toolbar">

<button id="addStudentBtn">
Add Student
</button>

<button id="importStudentsBtn">
Import Excel
</button>

<button id="exportStudentsBtn">
Export Excel
</button>

<button id="refreshStudents" onclick="loadStudents()">
Refresh
</button>

<input
type="file"
id="studentExcelFile"
accept=".xlsx,.xls"
style="display:none;">

</div>
<div class="filter-box">

<input
type="text"
id="searchStudent"
placeholder="Search Admission No or Name">

<select id="classFilter">
<option value="All">All Classes</option>
<option>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>
<option>9</option>
<option>10</option>
<option>11</option>
<option>12</option>
</select>

<select id="sectionFilter">
<option value="All">All Sections</option>
<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>
</select>

<select id="houseFilter">
<option value="All">All Houses</option>
<option>Spring</option>
<option>Summer</option>
<option>Winter</option>
</select>

<select id="attendanceFilter">
<option value="All">All Attendance</option>
<option>Present</option>
<option>Absent</option>
</select>

<select id="voteFilter">
<option value="All">All Students</option>
<option>Voted</option>
<option>Not Voted</option>
</select>

</div>

<table class="student-table">

<thead>

<tr>

<th>S.No</th>
<th>Admission No</th>
<th>Name</th>
<th>Class</th>
<th>Section</th>
<th>House</th>
<th>Attendance</th>
<th>Vote</th>
<th>Action</th>

</thead>

<tbody id="studentTable">

<tr>

<td colspan="8">

No Students Found

</td>

</tr>

</tbody>

</table>

`;

loadStudents();

}

if(page=="candidates"){

content.innerHTML = `


<h1>Candidate Management</h1>

<table class="student-table">

<thead>

<tr>
    <th>S.No</th>
    <th>Photo</th>
    <th>Admission No</th>
    <th>Name</th>
    <th>Class</th>
    <th>Section</th>
    <th>House</th>
    <th>Position</th>
    <th>Status</th>
    <th>Action</th>
</tr>

</thead>

<tbody id="candidateTable">

<tr>

<td colspan="9">

No Candidates Found

</td>

</tr>

</tbody>

</table>

`;

loadCandidates();

}

if(page=="election"){

content.innerHTML = `

<h1>Election Control</h1>

<div class="election-box">

<label>Election Name</label>
<input type="text" id="electionName" placeholder="School Election 2026">

<label>Election Date</label>
<input type="date" id="electionDate">

<label>Start Time</label>
<input type="time" id="startTime">

<label>End Time</label>
<input type="time" id="endTime">

<br><br>

<button id="startElectionBtn" class="green-btn">
🟢 Start Election
</button>

<button id="endElectionBtn" class="red-btn">
🔴 End Election
</button>

<button id="lockElectionBtn">
🔒 Lock Voting
</button>

<button id="unlockElectionBtn">
🔓 Unlock Voting
</button>

<button id="resetElectionBtn">
🔄 Reset Election
</button>

<hr>

<h3>Status :</h3>

<h2 id="electionStatus">
🔴 Not Started
</h2>

</div>

`;
loadElectionStatus();

}


if(page=="settings"){

content.innerHTML=`

<h1>Settings</h1>

<div class="settings-wrapper">

    <div class="settings-sidebar">

        <button class="settings-tab active" onclick="openSettingsTab('general')">
            General
        </button>

        <button class="settings-tab" onclick="openSettingsTab('school')">
            School
        </button>

        <button class="settings-tab" onclick="openSettingsTab('election')">
            Election
        </button>

        <button class="settings-tab" onclick="openSettingsTab('security')">
            Security
        </button>

        <button class="settings-tab" onclick="openSettingsTab('admin')">
            Admin
        </button>

        <button class="settings-tab" onclick="openSettingsTab('permissions')">
            Permissions
        </button>

        <button class="settings-tab" onclick="openSettingsTab('appearance')">
            Appearance
        </button>

        <button class="settings-tab" onclick="openSettingsTab('network')">
            Network
        </button>

        <button class="settings-tab" onclick="openSettingsTab('backup')">
            Backup & Restore
        </button>

        <button class="settings-tab" onclick="openSettingsTab('reports')">
            Reports
        </button>

        <button class="settings-tab" onclick="openSettingsTab('notifications')">
            Notifications
        </button>

        <button class="settings-tab" onclick="openSettingsTab('maintenance')">
            Maintenance
        </button>

        <button class="settings-tab" onclick="openSettingsTab('about')">
            About
        </button>

    </div>

    <div class="settings-content" id="settingsContent">

    </div>

</div>

`;

openSettingsTab("general");

}
}
// =====================================
// Save Student
// =====================================

document.addEventListener("click", function(e){

    if(e.target && e.target.id=="saveBtn"){

    if(role=="Viewer"){

        showDialog({

            title:"Access Denied",

            message:"Viewer cannot add students."

        });

        return;

    }

        let formData = new FormData();

        formData.append("admission", document.getElementById("admission").value);
        formData.append("name", document.getElementById("studentName").value);
        formData.append("class", document.getElementById("class").value);
        formData.append("section", document.getElementById("section").value);
        
        formData.append("house", document.getElementById("house").value);
        formData.append("attendance", document.getElementById("attendance").value);
        

        fetch("/save_student",{

            method:"POST",

            body:formData

        })

        .then(response=>response.json())

        .then(data=>{

if(data.status=="success"){

showDialog({

title:"Success",

message:"Student Added Successfully."

});
    document.getElementById("admission").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("class").selectedIndex = 0;
    document.getElementById("section").value = "";
    
    document.getElementById("house").selectedIndex = 0;
    document.getElementById("attendance").selectedIndex = 0;

}

            else{

                showDialog({

title:"Error",

message:"Admission Number Already Exists."

});

            }

        });

    }

});

// =====================================
// Clear Student Form
// =====================================

document.addEventListener("click", function(e){

    if(e.target && e.target.id=="clearBtn"){

        document.getElementById("admission").value = "";
        document.getElementById("studentName").value = "";
        document.getElementById("class").selectedIndex = 0;
        document.getElementById("section").value = "";
        
        document.getElementById("house").selectedIndex = 0;
        document.getElementById("attendance").selectedIndex = 0;

        showDialog({

title:"Success",

message:"Form Cleared Successfully."

});

    }

});

// =====================================
// Universal Popup
// =====================================

let popupCallback = null;

function showDialog(options){

console.log("showDialog called");
console.log(document.getElementById("popupTitle"));

    document.getElementById("popupTitle").innerHTML =
        options.title || "";

    document.getElementById("popupMessage").innerHTML =
        options.message || "";

    let okBtn = document.getElementById("popupOkBtn");
    let cancelBtn = document.getElementById("popupCancelBtn");

    okBtn.innerHTML = options.okText || "OK";

    if(options.confirm){

        cancelBtn.style.display="inline-block";

    }

    else{

        cancelBtn.style.display="none";

    }

    popupCallback = options.onConfirm || null;

    document.getElementById("popup").style.display="flex";

}

document.addEventListener("click", function(e){

    if(e.target.id=="popupOkBtn"){

        document.getElementById("popup").style.display="none";

        if(popupCallback){

            popupCallback();

            popupCallback=null;

        }

    }

    if(e.target.id=="popupCancelBtn"){

        document.getElementById("popup").style.display="none";

    }

});
// =====================================
// Load Students
// =====================================

function loadStudents(){

    fetch("/get_students")
    .then(response => response.json())
    .then(data => {

        let table = document.getElementById("studentTable");

        table.innerHTML = "";

        if(data.length == 0){

            table.innerHTML = `
            <tr>
                <td colspan="9">No Students Found</td>
            </tr>`;
            return;
        }

        data.forEach((student,index)=>{

            let actions="";

            if(role!="Viewer"){

                actions=`
                <button class="edit-btn"
                onclick="editStudent(
                '${student.admission_no}',
                '${student.name}',
                '${student.class_name}',
                '${student.section}',
                '${student.house}',
                '${student.attendance}'
                )">
                Edit
                </button>

                <button class="delete-btn"
                onclick="deleteStudent(
                '${student.admission_no}',
                '${student.name}'
                )">
                Delete
                </button>
                `;
            }

            table.innerHTML += `
            <tr>

            <td>${index+1}</td>
            <td class="admission">${student.admission_no}</td>
            <td class="name">${student.name}</td>
            <td class="class">${student.class_name}</td>
            <td class="section">${student.section}</td>
            <td class="house">${student.house}</td>
            <td class="attendance">${student.attendance}</td>
            <td class="vote">Not Voted</td>
            <td>${actions}</td>

            </tr>
            `;

        });

    });

}

function loadDashboard(){

    // Stop if dashboard is not visible
    if(!document.getElementById("totalStudents")) return;

    fetch("/dashboard_stats")
    .then(response => response.json())
    .then(data => {

        document.getElementById("totalStudents").innerHTML = data.students;
        document.getElementById("totalCandidates").innerHTML = data.candidates;
        document.getElementById("totalVotes").innerHTML = data.votes;
        document.getElementById("electionStatus").innerHTML = data.status;

    });

}

// =====================================
// Smart Filter
// =====================================

document.addEventListener("input", filterStudents);
document.addEventListener("change", filterStudents);

function filterStudents(){

    const search =
        document.getElementById("searchStudent")?.value.toLowerCase() || "";

    const classFilter =
        document.getElementById("classFilter")?.value || "All";

    const sectionFilter =
        document.getElementById("sectionFilter")?.value || "All";

    const houseFilter =
        document.getElementById("houseFilter")?.value || "All";

    const attendanceFilter =
        document.getElementById("attendanceFilter")?.value || "All";

    const voteFilter =
        document.getElementById("voteFilter")?.value || "All";

    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {

        const admission =
            row.querySelector(".admission")?.innerText.toLowerCase() || "";

        const name =
            row.querySelector(".name")?.innerText.toLowerCase() || "";

        const cls =
            row.querySelector(".class")?.innerText || "";

        const section =
            row.querySelector(".section")?.innerText || "";

        const house =
            row.querySelector(".house")?.innerText || "";

        const attendance =
            row.querySelector(".attendance")?.innerText || "";

        const vote =
            row.querySelector(".vote")?.innerText || "";

        let show = true;

        if(search &&
          !admission.includes(search) &&
          !name.includes(search))
            show = false;

        if(classFilter!="All" && cls!=classFilter)
            show = false;

        if(sectionFilter!="All" && section!=sectionFilter)
            show = false;

        if(houseFilter!="All" && house!=houseFilter)
            show = false;

        if(attendanceFilter!="All" && attendance!=attendanceFilter)
            show = false;

        if(voteFilter!="All" && vote!=voteFilter)
            show = false;

        row.style.display = show ? "" : "none";

    });

}

// =====================================
// Edit Student
// =====================================

function editStudent(admission,name,cls,section,house,attendance){

    showPage("registration");

    setTimeout(function(){

        document.getElementById("admission").value = admission;
        document.getElementById("studentName").value = name;
        document.getElementById("class").value = cls;
        document.getElementById("section").value = section;
        document.getElementById("house").value = house;
        document.getElementById("attendance").value = attendance;

        document.getElementById("saveBtn").style.display = "none";

        document.getElementById("updateBtn").style.display = "inline-block";

    },100);

}

// =====================================
// Update Student
// =====================================

document.addEventListener("click", function(e){

    if(e.target && e.target.id=="updateBtn"){
        if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot edit students."

    });

    return;

}

        let formData = new FormData();

        formData.append("admission", document.getElementById("admission").value);
        formData.append("name", document.getElementById("studentName").value);
        formData.append("class", document.getElementById("class").value);
        formData.append("section", document.getElementById("section").value);
        formData.append("house", document.getElementById("house").value);
        formData.append("attendance", document.getElementById("attendance").value);

        fetch("/update_student",{

            method:"POST",

            body:formData

        })

        .then(response=>response.json())

        .then(data=>{

            if(data.status=="success"){

                showDialog({

title:"Success",

message:"Student Updated Successfully."

});

                showPage("students");

            }

        });

    }

});

// =====================================
// Delete Student
// =====================================

function deleteStudent(admission,name){
    if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot delete students."

    });

    return;

}
    showDialog({

        title:"Delete Student",

        message:
        "Admission No : <b>"+admission+"</b><br><br>" +
        "Student Name : <b>"+name+"</b><br><br>" +
        "Are you sure you want to delete this student?",

        confirm:true,

        okText:"Delete",

        onConfirm:function(){

            let formData = new FormData();

            formData.append("admission", admission);

            fetch("/delete_student",{

                method:"POST",

                body:formData

            })

            .then(response=>response.json())

            .then(data=>{

                if(data.status=="success"){

                    showDialog({

                        title:"Success",

                        message:"Student Deleted Successfully."

                    });

                    loadStudents();

                }

            });

        }

    });

}

// =====================================
// Election Control
// =====================================

function loadElectionStatus(){

    fetch("/get_election_status")

    .then(res => res.json())

    .then(data => {

        let status = document.getElementById("electionStatus");

        let startBtn = document.getElementById("startElectionBtn");

        let endBtn = document.getElementById("endElectionBtn");

        if(!status) return;

        if(data.status=="Running"){

            status.innerHTML="🟢 Running";

            startBtn.disabled=true;
            endBtn.disabled=false;

        }

        else if(data.status=="Ended"){

            status.innerHTML="🔴 Ended";

            startBtn.disabled=false;
            endBtn.disabled=true;

        }

        else{

            status.innerHTML="🟡 Not Started";

            startBtn.disabled=false;
            endBtn.disabled=true;

        }

    });

}
document.addEventListener("click",function(e){

    if(e.target.id=="startElectionBtn"){
     if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot control election."

    });

    return;

}

        fetch("/start_election",{

            method:"POST"

        })

        .then(res=>res.json())

        .then(data=>{

            showDialog({

                title:"Election",

                message:"Election Started Successfully."

            });

            loadElectionStatus();

        });

    }

});

document.addEventListener("click",function(e){

    if(e.target.id=="endElectionBtn"){
     if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot control election."

    });

    return;

}

        fetch("/end_election",{

            method:"POST"

        })

        .then(res=>res.json())

        .then(data=>{

            showDialog({

                title:"Election",

                message:"Election Ended Successfully."

            });

            loadElectionStatus();

        });

    }

});

document.addEventListener("click",function(e){

    if(e.target.id=="lockElectionBtn"){
    if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot control election."

    });

    return;

}

        fetch("/lock_voting",{

            method:"POST"

        })

        .then(res=>res.json())

        .then(data=>{

            showDialog({

                title:"Voting Locked",

                message:"Voting has been locked successfully."

            });

        });

    }

});

document.addEventListener("click",function(e){

    if(e.target.id=="unlockElectionBtn"){
     if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot control election."

    });

    return;

}

        fetch("/unlock_voting",{

            method:"POST"

        })

        .then(res=>res.json())

        .then(data=>{

            showDialog({

                title:"Voting Unlocked",

                message:"Voting has been unlocked successfully."

            });

        });

    }

});

// =====================================
// Reset Election
// =====================================

document.addEventListener("click",function(e){

    if(e.target.id=="resetElectionBtn"){
     if(role=="Viewer"){

    showDialog({

        title:"Access Denied",

        message:"Viewer cannot control election."

    });

    return;

}

        showDialog({

            title:"Reset Election",

            message:"Are you sure you want to reset the election?<br><br>This cannot be undone.",

            confirm:true,

            okText:"Reset",

            onConfirm:function(){

                fetch("/reset_election",{

                    method:"POST"

                })

                .then(res=>res.json())

                .then(data=>{

                    showDialog({

                        title:"Success",

                        message:"Election has been reset successfully."

                    });

                    loadElectionStatus();

                });

            }

        });

    }

});

function openSettingsTab(tab){

    let content = document.getElementById("settingsContent");

    switch(tab){

        case "general":

content.innerHTML = `

<h2>General Settings</h2>

<label>Software Name</label>
<input type="text" id="softwareName">

<label>Software Version</label>
<input type="text" id="softwareVersion">

<label>Academic Year</label>
<input type="text" id="academicYear">

<br><br>

<button onclick="saveSettings()">
    Save Settings
</button>

`;

loadSettings();

break;
case "school":

content.innerHTML = `

<h2>School Settings</h2>

<label>School Name</label>
<input type="text" id="schoolName">

<label>School Address</label>
<textarea id="schoolAddress"></textarea>

<label>Phone</label>
<input type="text" id="phone">

<label>Email</label>
<input type="email" id="email">

<label>Website</label>
<input type="text" id="website">

<br><br>

<button onclick="saveSettings()">
    Save Settings
</button>

`;

loadSettings();

break;

        case "election":
            content.innerHTML = `
            <h2>Election</h2>

            <label>Election Name</label>
            <input type="text">

            <label>Election Date</label>
            <input type="date">

            <label>Start Time</label>
            <input type="time">

            <label>End Time</label>
            <input type="time">

            <button>Save</button>
            `;
            
            break;

        case "security":
            content.innerHTML = `

<h2>Security Settings</h2>

<label>Username</label>

<input type="text"
id="adminUsername">

<label>Current Password</label>

<input type="password"
id="currentPassword">

<label>New Password</label>

<input type="password"
id="newPassword">

<label>Confirm Password</label>

<input type="password"
id="confirmPassword">

<br><br>

<button onclick="changePassword()">

Save Security Settings

</button>

`;
break;
       case "admin":

content.innerHTML = `

<h2>Admin Management</h2>

<label>Username</label>
<input type="text" id="newAdmin">

<label>Password</label>
<input type="password" id="newPassword">

<label>Role</label>

<select id="adminRole">

<option>Super Admin</option>

<option>Election Officer</option>

<option>Viewer</option>

</select>

<br><br>

<button onclick="addAdmin()">

Add Admin

</button>

<hr>

<table class="student-table">

<thead>

<tr>

<th>ID</th>
<th>Username</th>
<th>Role</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody id="adminTable">

</tbody>

</table>

`;

loadAdmins();

break;
        case "appearance":
            content.innerHTML = `
            <h2>Appearance</h2>

            <button>Light Theme</button>
            <button>Dark Theme</button>
            <button>Blue Theme</button>
            `;
            break;

        case "network":
            content.innerHTML = `
            <h2>Network</h2>

            <p>Server IP : 127.0.0.1</p>
            <p>Port : 5000</p>

            <button>Refresh</button>
            `;
            break;

        case "backup":
            content.innerHTML = `
            <h2>Backup & Restore</h2>

            <button>Backup Database</button>

            <button>Restore Database</button>

            <button>Export Data</button>
            `;
            break;

        case "reports":
            content.innerHTML = `
            <h2>Reports</h2>

            <button>Generate Student Report</button>

            <button>Generate Election Report</button>
            `;
            break;

        case "notifications":
            content.innerHTML = `
            <h2>Notifications</h2>

            <label><input type="checkbox"> Enable Sound</label><br>

            <label><input type="checkbox"> Enable Popups</label><br>

            <button onclick="saveSettings()">
            Save Settings
            </button>
            `;
            break;

        case "maintenance":
            content.innerHTML = `
            <h2>Maintenance</h2>

            <button>Optimize Database</button>

            <button>Clear Logs</button>

            <button>Reset Application</button>
            `;
            break;

        case "about":
            content.innerHTML = `
            <h2>About</h2>

            <p><b>BPS Election Management System</b></p>

            <p>Version : 1.0</p>

            <p>Developed by Bharathi Public School</p>
            `;
            
            break;
    }
}
function loadSettings(){

    fetch("/get_settings")
    .then(response => response.json())
    .then(data=>{

        if(document.getElementById("softwareName"))
            document.getElementById("softwareName").value = data.software_name || "";

        if(document.getElementById("softwareVersion"))
            document.getElementById("softwareVersion").value = data.software_version || "";

        if(document.getElementById("academicYear"))
            document.getElementById("academicYear").value = data.academic_year || "";

        if(document.getElementById("schoolName"))
            document.getElementById("schoolName").value = data.school_name || "";

        if(document.getElementById("schoolAddress"))
            document.getElementById("schoolAddress").value = data.school_address || "";

        if(document.getElementById("phone"))
            document.getElementById("phone").value = data.phone || "";

        if(document.getElementById("email"))
            document.getElementById("email").value = data.email || "";

        if(document.getElementById("website"))
            document.getElementById("website").value = data.website || "";

    });

}
function saveSettings(){

    let formData = new FormData();

    if(document.getElementById("softwareName"))
        formData.append("software_name",
            document.getElementById("softwareName").value);

    if(document.getElementById("softwareVersion"))
        formData.append("software_version",
            document.getElementById("softwareVersion").value);

    if(document.getElementById("academicYear"))
        formData.append("academic_year",
            document.getElementById("academicYear").value);

    if(document.getElementById("schoolName"))
        formData.append("school_name",
            document.getElementById("schoolName").value);

    if(document.getElementById("schoolAddress"))
        formData.append("school_address",
            document.getElementById("schoolAddress").value);

    if(document.getElementById("phone"))
        formData.append("phone",
            document.getElementById("phone").value);

    if(document.getElementById("email"))
        formData.append("email",
            document.getElementById("email").value);

    if(document.getElementById("website"))
        formData.append("website",
            document.getElementById("website").value);

    fetch("/save_settings",{
        method:"POST",
        body:formData
    })
    .then(response => response.json())
    .then(data => {

        if(data.status=="success"){

            showDialog({
                title:"Success",
                message:"Settings Saved Successfully."
            });

        }

    });

}

function changePassword(){

let formData = new FormData();

formData.append(
"username",
document.getElementById(
"adminUsername"
).value
);

formData.append(
"current_password",
document.getElementById(
"currentPassword"
).value
);

formData.append(
"new_password",
document.getElementById(
"newPassword"
).value
);

formData.append(
"confirm_password",
document.getElementById(
"confirmPassword"
).value
);

fetch("/change_password",{

method:"POST",

body:formData

})

.then(res=>res.json())

.then(data=>{

showDialog({

title:"Security",

message:data.message

});

});

}

function addAdmin(){

let formData = new FormData();

formData.append(
"username",
document.getElementById(
"newAdmin"
).value
);

formData.append(
"password",
document.getElementById(
"newPassword"
).value
);

formData.append(
"role",
document.getElementById(
"adminRole"
).value
);

fetch("/add_admin",{

method:"POST",

body:formData

})

.then(res=>res.json())

.then(data=>{

showDialog({

title:"Admin",

message:data.message

});

loadAdmins();

});

}
function loadAdmins(){

fetch("/get_admins")

.then(res=>res.json())

.then(data=>{

let table=document.getElementById(
"adminTable"
);

table.innerHTML="";

data.forEach(admin=>{

table.innerHTML += `

<tr>

<td>${admin.id}</td>

<td>${admin.username}</td>

<td>${admin.role}</td>

<td>${admin.status}</td>

<td>

<button

onclick="deleteAdmin(${admin.id})"

class="delete-btn">

Delete

</button>

</td>

</tr>

`;

});

});

}
function hasPermission(action){

    if(role === "Super Admin")
        return true;

    if(role === "Election Officer"){

        const denied = [

            "settings",
            "admin",
            "security"

        ];

        return !denied.includes(action);

    }

    if(role === "Viewer"){

        return false;

    }

    return true;

}
function deleteAdmin(id){

fetch(

"/delete_admin/"+id,

{

method:"POST"

}

)

.then(res=>res.json())

.then(data=>{

showDialog({

title:"Admin",

message:data.message

});

loadAdmins();

});

}

window.onload=function(){

    loadDashboard();

    applyPermissions();

    if(role=="Viewer"){
        document.getElementById("settingsMenu")?.remove();
    }

    if(role=="Election Officer"){
        document.getElementById("settingsMenu")?.remove();
    }

};
function applyPermissions(){

    if(role=="Viewer"){

        document.querySelector(
        'button[onclick="showPage(\'registration\')"]'
        )?.remove();

        document.querySelector(
        'button[onclick="showPage(\'election\')"]'
        )?.remove();

        document.getElementById("settingsMenu")?.remove();

    }

    if(role=="Election Officer"){

        document.getElementById("settingsMenu")?.remove();

    }

}

function loadCandidates(){

    fetch("/get_candidates")

    .then(response => response.json())

    .then(data => {

        let table = document.getElementById("candidateTable");

        table.innerHTML = "";

        if(data.length==0){

            table.innerHTML=`

            <tr>

                <td colspan="10">

                    No Candidates Found

                </td>

            </tr>

            `;

            return;

        }

        data.forEach((candidate,index)=>{

            let photo = "/static/images/default.png";

            if(candidate.photo && candidate.photo!=""){

                photo = "/static/images/" + candidate.photo;

            }

            table.innerHTML += `

            <tr>

                <td>${index+1}</td>

                <td>

                    <img
                    src="${photo}"
                    width="60"
                    height="70"
                    style="
                    object-fit:cover;
                    border-radius:8px;
                    border:1px solid #ccc;">

                </td>

                <td>${candidate.admission_no}</td>

                <td>${candidate.name}</td>

                <td>${candidate.class_name}</td>

                <td>${candidate.section}</td>

                <td>${candidate.house}</td>

                <td>${candidate.position}</td>

                <td>${candidate.status}</td>

                <td>

<button
class="edit-btn"
onclick="editCandidate(
'${candidate.admission_no}',
'${candidate.position}'
)">
Edit
</button>

<button
class="delete-btn"
onclick="deleteCandidate(
'${candidate.admission_no}',
'${candidate.name}',
'${candidate.position}'
)">
Delete
</button>

                </td>

            </tr>

            `;

        });

    });

}

// =====================================
// Save Candidate
// =====================================

document.addEventListener("click", function(e){

    if(e.target && e.target.id=="saveCandidateBtn"){

        let formData = new FormData();

        formData.append(
            "admission",
            document.getElementById("candidateAdmission").value
        );

        formData.append(
            "name",
            document.getElementById("candidateName").value
        );

        formData.append(
            "class",
            document.getElementById("candidateClass").value
        );

        formData.append(
            "section",
            document.getElementById("candidateSection").value
        );

        formData.append(
            "house",
            document.getElementById("candidateHouse").value
        );

        formData.append(
            "position",
            document.getElementById("candidatePosition").value
        );
        
        formData.append(
            "photo",
            document.getElementById("candidatePhoto").files[0]
        );

        fetch("/save_candidate",{

            method:"POST",

            body:formData

        })

        .then(response=>response.json())

        .then(data=>{

            if(data.status=="success"){

                showDialog({

                    title:"Success",

                    message:"Candidate Added Successfully."

                });

                loadCandidates();

            }

            else{

                showDialog({

                    title:"Error",

                    message:"Candidate Already Exists."

                });

            }

        });

    }

});

// =====================================
// Fetch Student
// =====================================

document.addEventListener("click",function(e){

    if(e.target.id=="fetchStudentBtn"){

        let formData = new FormData();

        formData.append(

            "admission",

            document.getElementById(
                "candidateAdmission"
            ).value

        );

        fetch("/get_student_details",{

            method:"POST",

            body:formData

        })

        .then(res=>res.json())

        .then(data=>{

            if(data.status=="not_found"){

                showDialog({

                    title:"Error",

                    message:"Student Not Found."

                });

                return;

            }

            document.getElementById(
                "candidateName"
            ).value=data.name;

            document.getElementById(
                "candidateClass"
            ).value=data.class_name;

            document.getElementById(
                "candidateSection"
            ).value=data.section;

            document.getElementById(
                "candidateHouse"
            ).value=data.house;

        });

    }

});
// =====================================
// Edit Candidate
// =====================================

function editCandidate(admission,position){

    showPage("candidates");

    setTimeout(function(){

        document.getElementById("candidateAdmission").value = admission;

        document.getElementById("candidatePosition").value = position;

        document.getElementById("fetchStudentBtn").click();

        document.getElementById("saveCandidateBtn").innerHTML =
        "Update Candidate";

        document.getElementById("saveCandidateBtn").id =
        "updateCandidateBtn";

    },100);

}

// =====================================
// Update Candidate
// =====================================

document.addEventListener("click",function(e){

    if(e.target && e.target.id=="updateCandidateBtn"){

        let formData = new FormData();

        formData.append(
            "admission",
            document.getElementById("candidateAdmission").value
        );

        formData.append(
            "position",
            document.getElementById("candidatePosition").value
        );

        fetch("/update_candidate",{

            method:"POST",

            body:formData

        })

        .then(response=>response.json())

        .then(data=>{

            if(data.status=="success"){

                showDialog({

                    title:"Success",

                    message:"Candidate Updated Successfully."

                });

                showPage("candidates");

            }

        });

    }

});
function deleteCandidate(admission,name,position){

    showDialog({

        title:"Delete Candidate",

        message:
        "Admission No : <b>"+admission+"</b><br><br>" +
        "Candidate Name : <b>"+name+"</b><br><br>" +
        "Position : <b>"+position+"</b><br><br>" +
        "Are you sure you want to delete this candidate?",

        confirm:true,

        okText:"Delete",

        onConfirm:function(){

            let formData = new FormData();

            formData.append("admission", admission);

            fetch("/delete_candidate",{

                method:"POST",

                body:formData

            })

            .then(response=>response.json())

            .then(data=>{

                showDialog({

                    title:"Success",

                    message:"Candidate Deleted Successfully."

                });

                loadCandidates();

            });

        }

    });

}
// Open Excel File

document.addEventListener("click",function(e){

    if(e.target.id=="importStudentsBtn"){

        document.getElementById("studentExcelFile").click();

    }

});
// =============================
// Student Excel Selected
// =============================

document.addEventListener("change",function(e){

    if(e.target.id=="studentExcelFile"){

        importStudentsExcel();

    }

});
function importStudentsExcel(){

    let file =
    document.getElementById(
    "studentExcelFile"
    ).files[0];

    if(!file){

        return;

    }

    let formData = new FormData();

    formData.append("excel",file);

    fetch("/import_students",{

        method:"POST",

        body:formData

    })

    .then(res=>res.json())

    .then(data=>{

        showDialog({

            title:"Student Import",

            message:data.message

        });

        loadStudents();

    });

}
// =====================================
// Dashboard Statistics
// =====================================

function loadDashboard(){

    fetch("/dashboard_stats")

    .then(response => response.json())

    .then(data => {

        document.getElementById("totalStudents").innerHTML = data.students;
        document.getElementById("totalCandidates").innerHTML = data.candidates;
        document.getElementById("totalVotes").innerHTML = data.votes;
        document.getElementById("electionStatus").innerHTML = data.status;
        document.getElementById("presentStudents").innerHTML = data.present;
        document.getElementById("absentStudents").innerHTML = data.absent;

    });

}
// =====================================
// Candidate Photo Preview
// =====================================

document.addEventListener("change", function(e){

    if(e.target.id=="candidatePhoto"){

        let file = e.target.files[0];

        if(!file) return;

        let reader = new FileReader();

        reader.onload = function(event){

            document.getElementById("photoPreview").src =
            event.target.result;

        };

        reader.readAsDataURL(file);

    }

});