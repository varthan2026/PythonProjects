from flask import Flask, render_template, request, jsonify, session
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
# ==========================================
# Normalize Text
# ==========================================

def normalize(value):

    return value.strip().title()


def normalize_admission(value):

    return value.strip().upper()

# ==========================================
# Excel Column Mapping
# ==========================================

COLUMN_MAP = {

    # Admission Number
    "admission no": "admission_no",
    "admission number": "admission_no",
    "adm no": "admission_no",
    "admission": "admission_no",

    # Name
    "name": "name",
    "student name": "name",

    # Class
    "class": "class_name",
    "standard": "class_name",
    "grade": "class_name",

    # Section
    "section": "section",
    "sec": "section",

    # House
    "house": "house",

    # Attendance
    "attendance": "attendance"
}

app.secret_key="bps2027"
@app.route("/")
def home():
    return render_template("admin_login.html")


@app.route("/login", methods=["POST"])
def login():

    username = request.form["username"]
    password = request.form["password"]

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""

    SELECT username,role

    FROM admins

    WHERE username=? AND password=?

    """,(username,password))

    admin = cursor.fetchone()

    conn.close()

    if admin:

       session["username"] = admin[0]

       session["role"] = admin[1]

       return render_template(
         "admin.html",
         role=session["role"]
        )
    else:

            return "<h1>Invalid Username or Password</h1>"

# ==========================================
# Save Student
# ==========================================

@app.route("/save_student", methods=["POST"])
def save_student():
    if session.get("role") == "Viewer":

      return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    admission = normalize_admission(
        request.form["admission"]
    )

    name = normalize(
        request.form["name"]
    )

    class_name = request.form["class"].strip()

    section = normalize(
        request.form["section"]
    )

    house = normalize(
        request.form["house"]
    )

    attendance = normalize(
        request.form["attendance"]
    )
    
    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO students
        (admission_no, name, class_name, section, house, attendance)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (admission, name, class_name, section, house, attendance))

        conn.commit()
        conn.close()

        return jsonify({"status": "success"})

    except sqlite3.IntegrityError:

        conn.close()

        return jsonify({"status": "duplicate"})

@app.route("/get_students")
def get_students():

    conn = sqlite3.connect("election.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT admission_no,
               name,
               class_name,
               section,
               house,
               attendance
        FROM students
        ORDER BY class_name, name
    """)

    students = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify(students)

@app.route("/update_student", methods=["POST"])
def update_student():
    if session.get("role")=="Viewer":

       return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    admission = normalize_admission(
        request.form["admission"]
    )

    name = normalize(
        request.form["name"]
    )

    class_name = request.form["class"].strip()

    section = normalize(
        request.form["section"]
    )

    house = normalize(
        request.form["house"]
    )

    attendance = normalize(
        request.form["attendance"]
    )
    
    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE students
        SET
            name=?,
            class_name=?,
            section=?,
            house=?,
            attendance=?
        WHERE admission_no = ? COLLATE NOCASE
    """,(name,class_name,section,house,attendance,admission))

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})
@app.route("/dashboard_stats")
def dashboard_stats():

    conn = sqlite3.connect("election.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM students")
    total_students = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students WHERE attendance='Present'")
    present = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students WHERE attendance='Absent'")
    absent = cursor.fetchone()[0]

    try:
        cursor.execute("SELECT COUNT(*) FROM candidates")
        total_candidates = cursor.fetchone()[0]
    except:
        total_candidates = 0

    conn.close()

    return jsonify({
        "students": total_students,
        "present": present,
        "absent": absent,
        "candidates": total_candidates,
        "votes": 0,
        "status": "Not Started"
    })

@app.route("/delete_student",methods=["POST"])
def delete_student():
    if session.get("role")=="Viewer":

     return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    admission=request.form["admission"]

    conn=sqlite3.connect("election.db")

    cursor=conn.cursor()

    cursor.execute(
        "DELETE FROM students WHERE admission_no = ? COLLATE NOCASE",
        (admission,)
    )

    conn.commit()

    conn.close()

    return jsonify({"status":"success"})
# ==========================================
# Import Students
# ==========================================

import pandas as pd

@app.route("/import_students", methods=["POST"])
def import_students():

    if "excel" not in request.files:

        return jsonify({

            "status":"error",

            "message":"No file selected."

        })

    file = request.files["excel"]

    try:

        df = pd.read_excel(file)

        # ==========================================
        # Normalize Excel Column Names
        # ==========================================

        new_columns = {}

        for col in df.columns:

            clean = col.strip().lower()

            if clean in COLUMN_MAP:

                new_columns[col] = COLUMN_MAP[clean]

        df.rename(columns=new_columns, inplace=True)

        # ==========================================
        # Normalize Excel Data
        # ==========================================

        df["admission_no"] = df["admission_no"].astype(str).apply(normalize_admission)

        df["name"] = df["name"].astype(str).apply(normalize)

        df["class_name"] = df["class_name"].astype(str).str.strip()

        df["section"] = df["section"].astype(str).apply(normalize)

        df["house"] = df["house"].astype(str).apply(normalize)

        df["attendance"] = df["attendance"].astype(str).apply(normalize)

        # ==========================================
        # Validate Required Columns
        # ==========================================

        required_columns = [

            "admission_no",
            "name",
            "class_name",
            "section",
            "house",
            "attendance"

        ]

        missing = []

        for col in required_columns:

            if col not in df.columns:

                missing.append(col)

        if missing:

            return jsonify({

                "status":"error",

                "message":"Missing Columns : " + ", ".join(missing)

            })

        # ==========================================
        # Validate Every Row
        # ==========================================

        errors = []

        valid_house = [

            "Spring",
            "Summer",
            "Winter"

        ]

        valid_attendance = [

            "Present",
            "Absent"

        ]

        for index, row in df.iterrows():

            row_number = index + 2

            if row["admission_no"] == "":

                errors.append(
                    f"Row {row_number} : Admission Number Missing"
                )

            if row["name"] == "":

                errors.append(
                    f"Row {row_number} : Student Name Missing"
                )

            if row["house"] not in valid_house:

                errors.append(
                    f"Row {row_number} : Invalid House ({row['house']})"
                )

            if row["attendance"] not in valid_attendance:

                errors.append(
                    f"Row {row_number} : Invalid Attendance ({row['attendance']})"
                )

        if errors:

            return jsonify({

                "status":"error",

                "message":"\n".join(errors[:10])

            })

        return jsonify({

            "status":"success",

            "message":f"""

        Excel Verified Successfully

        Rows : {len(df)}

        Ready To Import : {len(df)}

        """

        })

    except Exception as e:

        return jsonify({

            "status":"error",

            "message":str(e)

        })
    
# ==========================================
# Save Candidate
# ==========================================

@app.route("/save_candidate", methods=["POST"])
def save_candidate():

    admission = normalize_admission(request.form["admission"])
    name = normalize(request.form["name"])
    class_name = request.form["class"].strip()
    section = normalize(request.form["section"])
    house = normalize(request.form["house"])
    position = normalize(request.form["position"])

    # -----------------------------
    # Save Photo
    # -----------------------------

    photo_name = ""

    if "photo" in request.files:

        photo = request.files["photo"]

        if photo.filename != "":

            extension = photo.filename.rsplit(".",1)[1].lower()

            photo_name = f"candidate_{admission}.{extension}"

            photo.save(
                os.path.join(
                    "static",
                    "images",
                    photo_name
                )
            )

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    try:

        cursor.execute("""
        INSERT INTO candidates
        (
            admission_no,
            name,
            class_name,
            section,
            house,
            position,
            photo
        )

        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        """,

        (
            admission,
            name,
            class_name,
            section,
            house,
            position,
            photo_name
        ))

        conn.commit()
        conn.close()

        return jsonify({"status":"success"})

    except sqlite3.IntegrityError:

        conn.close()

        return jsonify({"status":"duplicate"})
    
# ==========================================
# Update Candidate
# ==========================================

@app.route("/update_candidate", methods=["POST"])
def update_candidate():

    admission = request.form["admission"]
    position = request.form["position"]

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""

    UPDATE candidates

    SET

    position=?

    WHERE admission_no = ? COLLATE NOCASE

    """,(position, admission))

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})

# =====================================
# Delete Candidate
# =====================================

@app.route("/delete_candidate", methods=["POST"])
def delete_candidate():

    admission = request.form["admission"]

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM candidates WHERE admission_no = ? COLLATE NOCASE",
        (admission,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "status":"success"
    })
    
# ==========================================
# Get Candidates
# ==========================================

@app.route("/get_candidates")
def get_candidates():

    conn = sqlite3.connect("election.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""

    SELECT
        id,
        admission_no,
        name,
        class_name,
        section,
        house,
        position,
        photo,
        status

    FROM candidates

    ORDER BY position, name

    """)

    candidates = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify(candidates)

# ==========================================
# Get Student Details
# ==========================================

@app.route("/get_student_details", methods=["POST"])
def get_student_details():

    admission = request.form["admission"]

    conn = sqlite3.connect("election.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""

    SELECT

        admission_no,
        name,
        class_name,
        section,
        house

    FROM students

    WHERE admission_no = ? COLLATE NOCASE

    """,(admission,))

    student = cursor.fetchone()

    conn.close()

    if student:

        return jsonify(dict(student))

    else:

        return jsonify({"status":"not_found"})

# ==========================
# Start Election
# ==========================

@app.route("/start_election", methods=["POST"])
def start_election():
    if session.get("role")=="Viewer":

      return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE election_settings
    SET status='Running'
    WHERE id=1
    """)

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})


# ==========================
# End Election
# ==========================

@app.route("/end_election", methods=["POST"])
def end_election():
    if session.get("role")=="Viewer":

      return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE election_settings
    SET status='Ended'
    WHERE id=1
    """)

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})


# ==========================
# Get Election Status
# ==========================

@app.route("/get_election_status")
def get_election_status():

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT status
    FROM election_settings
    WHERE id=1
    """)

    status = cursor.fetchone()[0]

    conn.close()

    return jsonify({"status":status})

@app.route("/lock_voting", methods=["POST"])
def lock_voting():
    if session.get("role")=="Viewer":

      return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE election_settings
    SET voting_locked='Yes'
    WHERE id=1
    """)

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})
@app.route("/unlock_voting", methods=["POST"])
def unlock_voting():
    if session.get("role")=="Viewer":

       return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE election_settings
    SET voting_locked='No'
    WHERE id=1
    """)

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})

# ==========================
# Reset Election
# ==========================

@app.route("/reset_election", methods=["POST"])
def reset_election():
    if session.get("role")=="Viewer":

     return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    if session.get("role") != "Super Admin":
        return jsonify({
            "status": "error",
            "message": "Access Denied"
        })

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE election_settings
        SET
            status='Not Started',
            voting_locked='No',
            election_name='School Election',
            election_date='',
            start_time='',
            end_time=''
        WHERE id=1
    """)

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})

# ==========================
# Get Settings
# ==========================

@app.route("/get_settings")

def get_settings():

    conn = sqlite3.connect("election.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM settings WHERE id=1")
    row = cursor.fetchone()

    conn.close()

    if row is None:
        return jsonify({
            "school_name":"",
            "school_address":"",
            "phone":"",
            "email":"",
            "website":"",
            "academic_year":"",
            "software_name":"",
            "software_version":""
        })

    return jsonify(dict(row))


# ==========================
# Save Settings
# ==========================

@app.route("/save_settings", methods=["POST"])

def save_settings():
    if session.get("role")!="Super Admin":

       return jsonify({

        "status":"error",

        "message":"Access Denied"

    })

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE settings
    SET
        school_name=?,
        school_address=?,
        phone=?,
        email=?,
        website=?,
        academic_year=?,
        software_name=?,
        software_version=?
    WHERE id=1
    """, (

        request.form.get("school_name", ""),
        request.form.get("school_address", ""),
        request.form.get("phone", ""),
        request.form.get("email", ""),
        request.form.get("website", ""),
        request.form.get("academic_year", ""),
        request.form.get("software_name", ""),
        request.form.get("software_version", "")

    ))

    conn.commit()
    conn.close()

    return jsonify({"status":"success"})


@app.route("/change_password", methods=["POST"])
def change_password():

    username = request.form["username"]

    current = request.form["current_password"]

    new = request.form["new_password"]

    confirm = request.form["confirm_password"]

    if new != confirm:

        return jsonify({

            "status":"error",

            "message":"Passwords do not match"

        })

    conn = sqlite3.connect("election.db")

    cursor = conn.cursor()

    cursor.execute(

        """

        SELECT password

        FROM admins

        WHERE username=?

        """,

        (username,)

    )

    row = cursor.fetchone()

    if not row:

        conn.close()

        return jsonify({

            "status":"error",

            "message":"Admin not found"

        })

    if row[0] != current:

        conn.close()

        return jsonify({

            "status":"error",

            "message":"Current password incorrect"

        })

    cursor.execute(

        """

        UPDATE admins

        SET password=?

        WHERE username=?

        """,

        (new, username)

    )

    conn.commit()

    conn.close()

    return jsonify({

        "status":"success",

        "message":"Password Updated Successfully"

    })
@app.route("/add_admin",methods=["POST"])

def add_admin():
    if session.get("role")!="Super Admin":

        return jsonify({

            "status":"error",

            "message":"Access Denied"

    })

    username=request.form["username"]

    password=request.form["password"]

    role=request.form["role"]

    conn=sqlite3.connect("election.db")

    cursor=conn.cursor()

    try:

        cursor.execute("""

        INSERT INTO admins(

        username,
        password,
        role

        )

        VALUES(

        ?,?,?

        )

        """,

        (

        username,
        password,
        role

        )

        )

        conn.commit()

        conn.close()

        return jsonify({

        "status":"success",

        "message":"Admin Added"

        })

    except:

        conn.close()

        return jsonify({

        "status":"error",

        "message":"Admin Exists"

        })
@app.route("/get_admins")

def get_admins():
    if session.get("role")!="Super Admin":

        return jsonify({

               "status":"error",

               "message":"Access Denied"

    })

    conn=sqlite3.connect(

    "election.db"

    )

    conn.row_factory=sqlite3.Row

    cursor=conn.cursor()

    cursor.execute("""

    SELECT *

    FROM admins

    """)

    admins=[

    dict(x)

    for x in cursor.fetchall()

    ]

    conn.close()

    return jsonify(admins)
@app.route("/delete_admin/<int:id>",methods=["POST"])

def delete_admin(id):
    if session.get("role")!="Super Admin":

        return jsonify({

           "status":"error",

           "message":"Access Denied"

    })
    conn=sqlite3.connect(

    "election.db"

    )

    cursor=conn.cursor()

    cursor.execute(

    """

    DELETE FROM admins

    WHERE id=?

    """,

    (id,)

    )

    conn.commit()

    conn.close()

    return jsonify({

    "status":"success",

    "message":"Admin Deleted"

    })
@app.route("/get_role")
def get_role():

    return jsonify({

        "role":

        session.get(

        "role",

        "Viewer"

        )

    })
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
