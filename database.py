import sqlite3

conn = sqlite3.connect("election.db")

cursor = conn.cursor()

# -------------------------------
# Admin Table
# -------------------------------

cursor.execute("""
CREATE TABLE IF NOT EXISTS admins(

id INTEGER PRIMARY KEY AUTOINCREMENT,

username TEXT UNIQUE,

password TEXT,

role TEXT DEFAULT 'Super Admin',

status TEXT DEFAULT 'Active',

last_login TEXT

)

""")
# -------------------------------
# Student Table
# -------------------------------

cursor.execute("""
CREATE TABLE IF NOT EXISTS students(

id INTEGER PRIMARY KEY AUTOINCREMENT,

admission_no TEXT UNIQUE,

name TEXT,

class_name TEXT,

section TEXT,

roll_no TEXT,

house TEXT,

attendance TEXT

)
""")
# ===========================
# Candidates Table
# ===========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS candidates(

id INTEGER PRIMARY KEY AUTOINCREMENT,

admission_no TEXT UNIQUE,

name TEXT,

class_name TEXT,

section TEXT,

house TEXT,

position TEXT,

photo TEXT,

status TEXT DEFAULT 'Active'

)
""")
# ===========================
# Election Settings Table
# ===========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS election_settings(

id INTEGER PRIMARY KEY,

election_name TEXT,

election_date TEXT,

start_time TEXT,

end_time TEXT,

status TEXT,

voting_locked TEXT

)
""")

cursor.execute("""
INSERT OR IGNORE INTO election_settings
(id, election_name, election_date, start_time, end_time, status, voting_locked)

VALUES
(1,
'School Election',
'',
'',
'',
'Not Started',
'No')
""")
# -------------------------------
# Default Admin
# -------------------------------

cursor.execute("""

INSERT OR IGNORE INTO admins(

username,
password,
role,
status

)

VALUES(

'admin',
'admin123',
'Super Admin',
'Active'

)

""")
# ===========================
# Settings Table
# ===========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS settings(

id INTEGER PRIMARY KEY,

school_name TEXT,
school_address TEXT,
phone TEXT,
email TEXT,
website TEXT,

principal_name TEXT,

logo TEXT,

academic_year TEXT,

software_name TEXT,
software_version TEXT,

theme TEXT DEFAULT 'Light',

notifications TEXT DEFAULT 'On',

sound TEXT DEFAULT 'On'

)
""")

cursor.execute("""

INSERT OR IGNORE INTO settings(

id,
school_name,
theme,
notifications,
sound

)

VALUES(

1,
'Bharathi Public School',
'Light',
'On',
'On'

)

""")
conn.commit()
conn.close()

print("Database Created Successfully!")
