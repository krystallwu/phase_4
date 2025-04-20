from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv
import os, datetime
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)
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

# views:

@app.route("/api/flights_in_the_air")
def flights_in_the_air():
    rows = (
        db.session
          .execute(text("SELECT * FROM flights_in_the_air"))
          .mappings()
          .all()
    )

    def serialize_row(row):
        out = {}
        for k, v in row.items():
            # convert timedelta, datetime, date, time into strings
            if isinstance(v, (datetime.timedelta, datetime.datetime, datetime.date, datetime.time)):
                out[k] = str(v)
            else:
                out[k] = v
        return out

    data = [serialize_row(r) for r in rows]
    return jsonify(data)

@app.route("/api/flights_on_the_ground")
def flights_on_the_ground():
     rows = (
         db.session
           .execute(text("SELECT * FROM flights_on_the_ground"))
           .mappings()
           .all()
     )
 
     def serialize_row(row):
         out = {}
         for k, v in row.items():
             # convert timedelta, datetime, date, time into strings
             if isinstance(v, (datetime.timedelta, datetime.datetime, datetime.date, datetime.time)):
                 out[k] = str(v)
             else:
                 out[k] = v
         return out
 
     data = [serialize_row(r) for r in rows]
     return jsonify(data)
 
 
@app.route("/api/people_in_the_air")
def people_in_the_air():
     rows = (
         db.session
           .execute(text("SELECT * FROM people_in_the_air"))
           .mappings()
           .all()
     )
 
     def serialize_row(row):
         out = {}
         for k, v in row.items():
             if isinstance(v, (datetime.timedelta, datetime.datetime, datetime.date, datetime.time)):
                 out[k] = str(v)
             else:
                 out[k] = v
         return out
 
     data = [serialize_row(r) for r in rows]
     return jsonify(data)
 
 
@app.route("/api/people_on_the_ground")
def people_on_the_ground():
     rows = (
         db.session
           .execute(text("SELECT * FROM people_on_the_ground"))
           .mappings()
           .all()
     )
 
     def serialize_row(row):
         out = {}
         for k, v in row.items():
             if isinstance(v, (datetime.timedelta, datetime.datetime, datetime.date, datetime.time)):
                 out[k] = str(v)
             else:
                 out[k] = v
         return out
 
     data = [serialize_row(r) for r in rows]
     return jsonify(data)
 
 
@app.route("/api/route_summary")
def route_summary():
     rows = (
         db.session
           .execute(text("SELECT * FROM route_summary"))
           .mappings()
           .all()
     )
 
     def serialize_row(row):
         out = {}
         for k, v in row.items():
             if isinstance(v, (datetime.timedelta, datetime.datetime, datetime.date, datetime.time)):
                 out[k] = str(v)
             else:
                 out[k] = v
         return out
 
     data = [serialize_row(r) for r in rows]
     return jsonify(data)
 
 
@app.route("/api/alternative_airports")
def alternative_airports():
     rows = (
         db.session
           .execute(text("SELECT * FROM alternative_airports"))
           .mappings()
           .all()
     )
 
     def serialize_row(row):
         out = {}
         for k, v in row.items():
             if isinstance(v, (datetime.timedelta, datetime.datetime, datetime.date, datetime.time)):
                 out[k] = str(v)
             else:
                 out[k] = v
         return out
 
     data = [serialize_row(r) for r in rows]
     return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
