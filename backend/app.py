from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
user = os.getenv("DB_USER")
pw   = os.getenv("DB_PASS")
host = os.getenv("DB_HOST", "localhost")
dbnm = os.getenv("DB_NAME")
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@"
    f"{os.getenv('DB_HOST')}:3306/{os.getenv('DB_NAME')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

@app.route("/")
def index():
    return "Flask is up and running!"

@app.route("/api/health")
def health():
    try:
        # wrap your SQL in text()
        result = db.session.execute(text("SELECT 1")).scalar_one()
        return jsonify(status="ok", test=result)
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500

@app.route("/api/airlines")
def list_airlines():
    result = (
        db.session
          .execute(text("SELECT * FROM airline LIMIT 10"))
          .mappings()
          .all()
    )
    data = [dict(row) for row in result]   # turn each RowMapping into a dict
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
