# backend/main.py
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import face_recognition_models
import uvicorn
import numpy as np
import cv2
import face_recognition
import sqlite3

app = FastAPI(title="Smart Attendance System")

# -------------------- DATABASE SETUP --------------------

def init_db():
    """
    Initialize the SQLite database with two tables:
    1. students: stores student info and their face encodings
    2. attendance: stores attendance logs
    """
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    # Table for students
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            roll_no TEXT UNIQUE NOT NULL,
            face_encoding BLOB NOT NULL
        )
    """)

    # Table for attendance records
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            date TEXT,
            status TEXT,
            FOREIGN KEY (student_id) REFERENCES students (id)
        )
    """)

    conn.commit()
    conn.close()

# Run DB initialization once at startup
init_db()


def fetch_students():
    """
    Fetch all students with their stored encodings from the database.
    Returns a list of dicts: {id, name, encoding}
    """
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, face_encoding FROM students")
    rows = cursor.fetchall()
    conn.close()

    student_data = []
    for row in rows:
        student_data.append({
            "id": row[0],
            "name": row[1],
            "encoding": np.frombuffer(row[2], dtype=np.float64)
        })
    return student_data


# -------------------- API ROUTES --------------------

@app.post("/register_student/")
async def register_student(
    name: str = Form(...),
    roll_no: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Register a new student with their name, roll number, and face image.
    - Extracts face encoding from the uploaded image.
    - Stores it in the database.
    """
    image_bytes = await file.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert to RGB for face_recognition
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect face and encode
    face_locations = face_recognition.face_locations(rgb_frame)
    encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    if not encodings:
        return JSONResponse({"status": "failed", "msg": "No face detected in image"})

    encoding = encodings[0].tobytes()  # Store as binary

    # Save student to DB
    try:
        conn = sqlite3.connect("students.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO students (name, roll_no, face_encoding) VALUES (?, ?, ?)",
            (name, roll_no, encoding)
        )
        conn.commit()
        conn.close()
        return {"status": "success", "msg": f"Student {name} registered successfully"}
    except sqlite3.IntegrityError:
        return JSONResponse({"status": "failed", "msg": "Roll number already exists"})


@app.post("/mark_attendance/")
async def mark_attendance(
    file: UploadFile = File(...), 
    roll_no: str = Form(...)
):
    # Step 1: Load the uploaded image
    image_bytes = await file.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Step 2: Detect face encodings
    face_locations = face_recognition.face_locations(rgb_frame)
    encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    if not encodings:
        return JSONResponse({"status": "failed", "msg": "No face detected"})

    # Step 3: Get student by roll_no
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, face_encoding FROM students WHERE roll_no=?", (roll_no,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return JSONResponse({"status": "failed", "msg": "Student not found"})

    student_id, student_name, stored_encoding = row
    stored_encoding = np.frombuffer(stored_encoding, dtype=np.float64)

    # Step 4: Compare face encoding
    for encoding in encodings:
        match = face_recognition.compare_faces([stored_encoding], encoding, tolerance=0.5)
        if match[0]:
            # Step 5: Mark attendance only if not already marked
            conn = sqlite3.connect("students.db")
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id FROM attendance WHERE student_id=? AND date=date('now')",
                (student_id,)
            )
            already_marked = cursor.fetchone()

            if already_marked:
                conn.close()
                return {
                    "status": "success",
                    "student": student_name,
                    "roll_no": roll_no,
                    "msg": "Attendance already marked"
                }

            cursor.execute(
                "INSERT INTO attendance (student_id, date, status) VALUES (?, date('now'), 'Present')",
                (student_id,)
            )
            conn.commit()
            conn.close()

            return {
                "status": "success",
                "student": student_name,
                "roll_no": roll_no,
                "msg": "Attendance marked successfully"
            }

    return JSONResponse({"status": "failed", "msg": "Face does not match roll number"})



# -------------------- MAIN ENTRY --------------------

if __name__ == "__main__":
    print("🚀 Starting Smart Attendance Backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
