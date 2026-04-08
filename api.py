"""
HireFlow API — Flask REST backend for the job application tracker.
Run: python api.py   (requires: pip install flask flask-cors)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, os, time

app = Flask(__name__)
CORS(app)

DB = "hireflow.db"


# ── Database ──────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                company   TEXT    NOT NULL,
                role      TEXT    NOT NULL,
                status    TEXT    NOT NULL DEFAULT 'applied',
                date      TEXT    NOT NULL,
                location  TEXT,
                salary    TEXT,
                url       TEXT,
                notes     TEXT,
                created   INTEGER NOT NULL
            )
        """)
        db.commit()


def row_to_dict(row):
    return dict(row) if row else None


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/jobs", methods=["GET"])
def list_jobs():
    status = request.args.get("status")
    db = get_db()
    if status:
        rows = db.execute(
            "SELECT * FROM jobs WHERE status = ? ORDER BY created DESC", (status,)
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM jobs ORDER BY created DESC"
        ).fetchall()
    return jsonify([row_to_dict(r) for r in rows])


@app.route("/jobs", methods=["POST"])
def create_job():
    data = request.get_json(force=True)
    required = ("company", "role", "date")
    if not all(data.get(f) for f in required):
        return jsonify({"error": "company, role, and date are required"}), 400

    db = get_db()
    cursor = db.execute(
        """INSERT INTO jobs (company, role, status, date, location, salary, url, notes, created)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            data["company"],
            data["role"],
            data.get("status", "applied"),
            data["date"],
            data.get("location", ""),
            data.get("salary", ""),
            data.get("url", ""),
            data.get("notes", ""),
            int(time.time()),
        ),
    )
    db.commit()
    job = row_to_dict(db.execute("SELECT * FROM jobs WHERE id = ?", (cursor.lastrowid,)).fetchone())
    return jsonify(job), 201


@app.route("/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    db = get_db()
    row = db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
    if not row:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(row_to_dict(row))


@app.route("/jobs/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    data = request.get_json(force=True)
    db = get_db()
    row = db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
    if not row:
        return jsonify({"error": "Job not found"}), 404

    fields = ("company", "role", "status", "date", "location", "salary", "url", "notes")
    updates = {f: data[f] for f in fields if f in data}
    if not updates:
        return jsonify({"error": "Nothing to update"}), 400

    set_clause = ", ".join(f"{k} = ?" for k in updates)
    db.execute(
        f"UPDATE jobs SET {set_clause} WHERE id = ?",
        (*updates.values(), job_id),
    )
    db.commit()
    job = row_to_dict(db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone())
    return jsonify(job)


@app.route("/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    db = get_db()
    row = db.execute("SELECT id FROM jobs WHERE id = ?", (job_id,)).fetchone()
    if not row:
        return jsonify({"error": "Job not found"}), 404
    db.execute("DELETE FROM jobs WHERE id = ?", (job_id,))
    db.commit()
    return jsonify({"deleted": job_id})


@app.route("/stats", methods=["GET"])
def stats():
    db = get_db()
    totals = dict(db.execute(
        "SELECT status, COUNT(*) as n FROM jobs GROUP BY status"
    ).fetchall() or [])
    total = db.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
    offers  = totals.get("offer", 0)
    active  = (totals.get("applied", 0) + totals.get("interviewing", 0))
    rate    = round(offers / total * 100, 1) if total else 0
    return jsonify({
        "total": total,
        "applied": totals.get("applied", 0),
        "interviewing": totals.get("interviewing", 0),
        "offer": offers,
        "rejected": totals.get("rejected", 0),
        "active": active,
        "response_rate": rate,
    })


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    print("HireFlow API running at http://localhost:5000")
    app.run(debug=True, port=5000)
