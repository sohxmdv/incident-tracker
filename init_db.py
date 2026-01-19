import sqlite3
conn = sqlite3.connect('incidents.db')
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    type TEXT,
    location TEXT,
    description TEXT,
    status TEXT,
    timestamp TEXT
)
''')
conn.commit()
conn.close()
