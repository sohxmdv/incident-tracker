# Incident Tracker

A lightweight, Flask-based web application designed to log, manage, and track incidents efficiently. This tool provides a streamlined interface for reporting issues and monitoring their status through a centralized dashboard.

## 🚀 Features

- **Incident Logging:** Quickly report new incidents with essential details.
- **Dashboard View:** A clean interface to view all active and historical incidents.
- **Database Integration:** Persistent storage using SQLite for reliable data management.
- **Responsive Design:** Built with HTML/CSS templates for a user-friendly experience across devices.

## 🛠️ Tech Stack

- **Backend:** Python (Flask)
- **Database:** SQLite
- **Frontend:** HTML, Jinja2 Templates
- **Language Breakdown:** HTML (78%), Python (22%)

## 📁 Project Structure

```text
incident-tracker/
├── app.py              # Main Flask application logic
├── init_db.py          # Script to initialize the SQLite database
├── incidents.db        # SQLite database file (generated after init)
└── templates/          # HTML templates for the web interface
