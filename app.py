from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from flask_socketio import SocketIO, emit
from datetime import datetime
import uuid
import sqlite3

app = Flask(__name__)
app.secret_key = 'supersecret'
socketio = SocketIO(app)

DB = 'incidents.db'

def save_incident(data):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO incidents VALUES (?, ?, ?, ?, ?, ?)", 
                   (data['id'], data['type'], data['location'], data['description'], data['status'], data['timestamp']))
    conn.commit()
    conn.close()

def update_incident_status(data):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()
    cursor.execute("UPDATE incidents SET status=? WHERE id=?", 
                   (data['status'], data['id']))
    conn.commit()
    conn.close()

def get_all_incidents():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents")
    rows = cursor.fetchall()
    conn.close()
    incidents = []
    for row in rows:
        incidents.append({
            'id': row[0],
            'type': row[1],
            'location': row[2],
            'description': row[3],
            'status': row[4],
            'timestamp': row[5]
        })
    return incidents

@app.route('/')
def index():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    users = {
        'admin1': {'password': 'adminpass', 'role': 'admin'},
        'user1': {'password': 'userpass', 'role': 'user'},
        'user2': {'password': 'userpass', 'role': 'user'}
    }

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = users.get(username)
        if user and user['password'] == password:
            session['username'] = username
            session['role'] = user['role']
            return redirect(url_for(user['role']))
        else:
            return "Invalid credentials", 403

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/user')
def user():
    if session.get('role') != 'user':
        return redirect('/login')
    return render_template('user.html')

@app.route('/admin')
def admin():
    if session.get('role') != 'admin':
        return redirect('/login')
    return render_template('admin.html')

@app.route('/incidents')
def fetch_incidents():
    if session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify(get_all_incidents())

@socketio.on('report_incident')
def handle_incident(data):
    data['id'] = str(uuid.uuid4())
    data['status'] = 'Pending'
    data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    save_incident(data)
    emit('incident_received', data, broadcast=True)

@socketio.on('update_status')
def handle_status_update(data):
    update_incident_status(data)
    emit('incident_status_updated', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
