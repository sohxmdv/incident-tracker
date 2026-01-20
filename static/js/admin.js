const socket = io();
let allIncidents = [];

// Fetch initial data
window.onload = () => {
    fetch('/incidents')
        .then(res => res.json())
        .then(data => {
            allIncidents = data;
            filterAndRender();
        });
};

function updateStats() {
    const counts = { Pending: 0, "In Progress": 0, Resolved: 0 };
    allIncidents.forEach(i => counts[i.status]++);
    document.getElementById('pendingCount').textContent = counts.Pending;
    document.getElementById('inProgressCount').textContent = counts["In Progress"];
    document.getElementById('resolvedCount').textContent = counts.Resolved;
}

function filterAndRender() {
    const search = document.getElementById('searchBar').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;

    const filtered = allIncidents.filter(i => {
        const matchesSearch = i.type.toLowerCase().includes(search) || i.location.toLowerCase().includes(search);
        const matchesStatus = status === 'All' || i.status === status;
        return matchesSearch && matchesStatus;
    });

    renderFeed(filtered);
    updateStats();
}

function renderFeed(incidents) {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    incidents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(data => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div class="incident-header">
                <span class="incident-title">${data.type} @ <span class="incident-location">${data.location}</span></span>
                <span class="incident-time">${data.timestamp}</span>
            </div>
            <p class="incident-desc">${data.description}</p>
            <div class="action-buttons">
                <button class="btn-status ${data.status === 'Pending' ? 'active-pending' : ''}" onclick="changeStatus('${data.id}', 'Pending')">Pending</button>
                <button class="btn-status ${data.status === 'In Progress' ? 'active-progress' : ''}" onclick="changeStatus('${data.id}', 'In Progress')">In Progress</button>
                <button class="btn-status ${data.status === 'Resolved' ? 'active-resolved' : ''}" onclick="changeStatus('${data.id}', 'Resolved')">Resolved</button>
            </div>
        `;
        feed.appendChild(div);
    });
}

function changeStatus(id, newStatus) {
    const incident = allIncidents.find(i => i.id === id);
    if (incident) {
        socket.emit('update_status', { ...incident, status: newStatus });
    }
}

// Socket events
socket.on('incident_received', (data) => {
    allIncidents.push(data);
    filterAndRender();
});

socket.on('incident_status_updated', (data) => {
    const idx = allIncidents.findIndex(i => i.id === data.id);
    if (idx !== -1) allIncidents[idx].status = data.status;
    filterAndRender();
});

document.getElementById('searchBar').addEventListener('input', filterAndRender);
document.getElementById('statusFilter').addEventListener('change', filterAndRender);

document.getElementById('clearAllBtn').onclick = () => {
    if (confirm("Delete all incident records?")) {
        fetch('/incidents', { method: 'DELETE' }).then(() => {
            allIncidents = [];
            filterAndRender();
        });
    }
};