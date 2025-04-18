from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

@app.route('/api/hello')
def hello():
    return jsonify(message='Hello from Flask')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(port=5000)
