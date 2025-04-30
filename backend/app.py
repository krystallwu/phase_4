import os
import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@"
    f"{os.getenv('DB_HOST', 'localhost')}:3306/{os.getenv('DB_NAME')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


def _serialize_row(row):
    out = {}
    for k, v in row.items():
        if isinstance(v, (datetime.timedelta,
                          datetime.datetime,
                          datetime.date,
                          datetime.time)):
            out[k] = str(v)
        else:
            out[k] = v
    return out


@app.route("/")
def index():
    return "Flask is up and running!"


@app.route("/api/health")
def health():
    try:
        result = db.session.execute(text("SELECT 1")).scalar_one()
        return jsonify(status="ok", test=result)
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500


@app.route("/api/airlines")
def list_airlines():
    rows = db.session.execute(text("SELECT * FROM airline LIMIT 10")) \
                     .mappings().all()
    return jsonify([dict(r) for r in rows])


# --- stored-proc endpoints --- #

@app.route("/api/add_airplane", methods=["POST"])
def api_add_airplane():
    ip = request.get_json() or {}
    params = {
        "ip_airlineID":     ip["ip_airlineID"],
        "ip_tail_num":      ip["ip_tail_num"],
        "ip_seat_capacity": ip["ip_seat_capacity"],
        "ip_speed":         ip["ip_speed"],
        "ip_locationID":    ip["ip_locationID"],
        "ip_plane_type":    ip["ip_plane_type"],
        "ip_maintenanced":  ip["ip_maintenanced"],
        "ip_model":         ip.get("ip_model"),
        "ip_neo":           ip["ip_neo"]
    }
    db.session.execute(text("""
        CALL add_airplane(
          :ip_airlineID,
          :ip_tail_num,
          :ip_seat_capacity,
          :ip_speed,
          :ip_locationID,
          :ip_plane_type,
          :ip_maintenanced,
          :ip_model,
          :ip_neo
        )
    """), params)
    db.session.commit()
    return jsonify(success=True, message="Airplane added"), 201


@app.route("/api/add_airport", methods=["POST"])
def api_add_airport():
    data = request.get_json() or {}
    db.session.execute(text("""
        CALL add_airport(
          :ip_airportID,
          :ip_airport_name,
          :ip_city,
          :ip_state,
          :ip_country,
          :ip_locationID
        )
    """), data)
    db.session.commit()
    return jsonify(success=True), 201


@app.route("/api/add_person", methods=["POST"])
def api_add_person():
    data = request.get_json() or {}
    db.session.execute(text("""
        CALL add_person(
          :ip_personID,
          :ip_first_name,
          :ip_last_name,
          :ip_locationID,
          :ip_taxID,
          :ip_experience,
          :ip_miles,
          :ip_funds
        )
    """), data)
    db.session.commit()
    return jsonify(success=True), 201


@app.route("/api/assign_pilot", methods=["POST"])
def api_assign_pilot():
    data = request.get_json() or {}
    db.session.execute(text("""
        CALL assign_pilot(
          :ip_flightID,
          :ip_personID
        )
    """), {
        "ip_flightID": data["ip_flightID"],
        "ip_personID": data["ip_personID"]
    })
    db.session.commit()
    return jsonify(success=True), 200


@app.route("/api/flight_landing", methods=["POST"])
def api_flight_landing():
    data = request.get_json() or {}
    fid = data.get("flight_id")
    if not fid:
        return jsonify(error="`flight_id` is required"), 400

    db.session.execute(text("CALL flight_landing(:fid)"), {"fid": fid})
    db.session.commit()
    return jsonify(success=True, message=f"Flight {fid} landed"), 200


@app.route("/api/flight_takeoff", methods=["POST"])
def api_flight_takeoff():
    data = request.get_json() or {}
    fid = data.get("flight_id")
    if not fid:
        return jsonify(error="`flight_id` is required"), 400

    db.session.execute(text("CALL flight_takeoff(:fid)"), {"fid": fid})
    db.session.commit()
    return jsonify(success=True, message=f"Flight {fid} took off"), 200


@app.route("/api/grant_or_revoke_pilot_license", methods=["POST"])
def api_grant_or_revoke_pilot_license():
    data = request.get_json() or {}
    pid = data.get("ip_personID")
    lic = data.get("ip_license")
    if not pid or not lic:
        return jsonify(success=False, message="ip_personID & ip_license required"), 400

    db.session.execute(text("""
        CALL grant_or_revoke_pilot_license(:pid, :lic)
    """), {"pid": pid, "lic": lic})
    db.session.commit()
    return jsonify(success=True, message=f"License {lic} toggled"), 200


@app.route("/api/offer_flight", methods=["POST"])
def api_offer_flight():
    data = request.get_json() or {}
    required = [
        "ip_flightID","ip_routeID","ip_support_airline",
        "ip_support_tail","ip_progress","ip_next_time","ip_cost"
    ]
    if any(k not in data or data[k] == "" for k in required):
        return jsonify(success=False, message="All fields required"), 400

    db.session.execute(text("""
      CALL offer_flight(
        :fid, :rid, :airline, :tail,
        :prog, :ntime, :cost
      )
    """), {
        "fid": data["ip_flightID"],
        "rid": data["ip_routeID"],
        "airline": data["ip_support_airline"],
        "tail": data["ip_support_tail"],
        "prog": int(data["ip_progress"]),
        "ntime": data["ip_next_time"],
        "cost": int(data["ip_cost"])
    })
    db.session.commit()
    return jsonify(success=True, message=f"Flight {data['ip_flightID']} offered"), 201

@app.route("/api/passengers_board", methods=["POST"])
def api_passengers_board():
    data = request.get_json() or {}
    # require the stored-proc param
    required = ["ip_flightID"]
    if any(k not in data or data[k] == "" for k in required):
        return jsonify(success=False, message="ip_flightID is required"), 400

    # call the passengers_board SP
    db.session.execute(text("""
      CALL passengers_board(:fid)
    """), {
      "fid": data["ip_flightID"]
    })
    db.session.commit()

    return jsonify(success=True, message=f"Flight {data['ip_flightID']} boarded"), 201

@app.route("/api/passengers_disembark", methods=["POST"])
def api_passengers_disembark():
    data = request.get_json() or {}
    # require the stored-proc param
    required = ["ip_flightID"]
    if any(k not in data or data[k] == "" for k in required):
        return jsonify(success=False, message="ip_flightID is required"), 400

    # call the passengers_board SP
    db.session.execute(text("""
      CALL passengers_disembark(:fid)
    """), {
      "fid": data["ip_flightID"]
    })
    db.session.commit()

    return jsonify(success=True, message=f"Flight {data['ip_flightID']} disembarked"), 201

@app.route('/api/recycle_crew', methods=['POST'])
def api_recycle_crew():
    data = request.get_json()
    # require the stored-proc param
    required = ["ip_flightID"]
    if any(k not in data or data[k] == "" for k in required):
        return jsonify(success=False, message="Missing flight ID"), 400
    try:
        db.session.execute(text("""
        CALL recycle_crew(:fid)
        """), {
        "fid": data["ip_flightID"]
        })
        db.session.commit()
        return jsonify(success=True, message=f"Flight {data['ip_flightID']} crew recycled"), 201
    except Exception as e:
        return jsonify(success=False, message=str(e))


@app.route('/api/retire_flight', methods=['POST'])
def api_retire_flight():
    data = request.get_json()
    # require the stored-proc param
    required = ["ip_flightID"]
    if any(k not in data or data[k] == "" for k in required):
        return jsonify(success=False, message="Missing flight ID")
    try:
        db.session.execute(text("""
        CALL retire_flight(:fid)
        """), {
        "fid": data["ip_flightID"]
        })
        db.session.commit()
        return jsonify(success=True, message=f"Flight {data['ip_flightID']} retired"), 201
    except Exception as e:
        return jsonify(success=False, message=str(e))


@app.route('/api/simulation_cycle', methods=['POST'])
def api_simulation_cycle():
    try:
        db.session.execute(text("""
        CALL simulation_cycle()
        """), {
        })
        db.session.commit()
        return jsonify(success=True, message=f"Flight simulation updated"), 201
    except Exception as e:
        return jsonify(success=False, message=str(e))



# --- view endpoints --- #

@app.route("/api/flights_in_the_air")
def flights_in_the_air():
    rows = db.session.execute(text("SELECT * FROM flights_in_the_air")) \
                     .mappings().all()
    return jsonify([_serialize_row(r) for r in rows])


@app.route("/api/flights_on_the_ground")
def flights_on_the_ground():
    rows = db.session.execute(text("SELECT * FROM flights_on_the_ground")) \
                     .mappings().all()
    return jsonify([_serialize_row(r) for r in rows])


@app.route("/api/people_in_the_air")
def people_in_the_air():
    rows = db.session.execute(text("SELECT * FROM people_in_the_air")) \
                     .mappings().all()
    return jsonify([_serialize_row(r) for r in rows])


@app.route("/api/people_on_the_ground")
def people_on_the_ground():
    rows = db.session.execute(text("SELECT * FROM people_on_the_ground")) \
                     .mappings().all()
    return jsonify([_serialize_row(r) for r in rows])


@app.route("/api/route_summary")
def route_summary():
    rows = db.session.execute(text("SELECT * FROM route_summary")) \
                     .mappings().all()
    return jsonify([_serialize_row(r) for r in rows])


@app.route("/api/alternative_airports")
def alternative_airports():
    rows = db.session.execute(text("SELECT * FROM alternative_airports")) \
                     .mappings().all()
    return jsonify([_serialize_row(r) for r in rows])



@app.route("/api/airports")
def list_airports():
    rows = db.session.execute(text("""
      SELECT airportID, airport_name, city, state, country, locationID
      FROM airport
      ORDER BY airportID
    """)).mappings().all()
    return jsonify([_serialize_row(r) for r in rows])



@app.route("/api/flights")
def list_all_flights():
    rows = db.session.execute(text("""
      SELECT
        flightID,
        routeID,
        support_airline,
        support_tail,
        progress,
        next_time,
        cost
      FROM flight
      ORDER BY flightID
    """)).mappings().all()
    return jsonify([_serialize_row(r) for r in rows])
@app.route("/api/people")
def list_people():
    rows = db.session.execute(text("""
      SELECT p.personID, p.first_name, p.last_name, p.locationID,
             COALESCE(pil.experience, pas.funds) AS role_data
      FROM person p
      LEFT JOIN pilot pil ON p.personID=pil.personID
      LEFT JOIN passenger pas ON p.personID=pas.personID
      ORDER BY p.personID
    """)).mappings().all()
    return jsonify([_serialize_row(r) for r in rows])

@app.route("/api/pilot_assignments")
def list_pilot_assignments():
    rows = db.session.execute(text("""
      SELECT personID, commanding_flight
      FROM pilot
      ORDER BY personID
    """)).mappings().all()
    return jsonify([_serialize_row(r) for r in rows])

@app.route("/api/airplanes")
def list_airplanes_table():
    rows = db.session.execute(text("""
       SELECT
         airlineID,
         tail_num,
         seat_capacity,
         speed,
         locationID,
         plane_type,
         maintenanced,
         model,
         neo
       FROM airplane
       ORDER BY airlineID, tail_num
     """)).mappings().all()
    return jsonify([_serialize_row(r) for r in rows])

@app.route("/api/pilot_licenses")
def list_pilot_licenses():
    rows = db.session.execute(text("SELECT * FROM pilot_licenses")) \
                     .mappings().all()
    return jsonify([dict(r) for r in rows])



if __name__ == "__main__":
    app.run(debug=True, port=5000)
