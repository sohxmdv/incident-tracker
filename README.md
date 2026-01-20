# 🛡️ Live Incident Tracker

A high-performance, real-time incident management system featuring a modern **Glassmorphism UI**. This application allows users to report incidents instantly and enables administrators to manage them through a live, synchronized dashboard.



## ✨ Key Features

* **Real-Time Live Feed**: Integrated **Flask-SocketIO** to broadcast new incidents and status updates to all connected clients instantly without page refreshes.
* **Modern Glassmorphism UI**: Developed a premium "Soft UI" aesthetic using CSS backdrop-filters, custom variables, and glowing status indicators for a professional look.
* **Admin Management Hub**: Includes live statistics (Pending, In Progress, Resolved), advanced search functionality, and real-time status control.
* **Responsive & Intuitive**: Optimized for clear visual hierarchy, ensuring incident details are scannable and easy to read.

## 🛠️ Tech Stack

* **Backend**: Python (Flask), Flask-SocketIO.
* **Frontend**: JavaScript (ES6+), HTML5, CSS3 (Custom Glassmorphism).
* **Database**: SQLite3 (Persistent incident storage).

## 📂 Project Structure

```text
INCIDENT-TRACKER/
├── static/
│   ├── css/
│   │   └── style.css      # Custom Glassmorphism styles
│   └── js/
│       ├── admin.js       # Admin filtering & status logic
│       └── user.js        # User reporting & live feed logic
├── templates/
│   ├── index.html         # Role selection
│   ├── login.html         # Glassmorphism login page
│   ├── admin.html         # Admin dashboard
│   └── user.html          # User reporting dashboard
├── app.py                 # Flask server & WebSocket handling
└── incidents.db           # SQLite database
