const socket = io();

// Handle Form Submission
document.getElementById('incidentForm').onsubmit = function (e) {
    e.preventDefault();

    const incident = {
        type: document.getElementById('type').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };

    // Send to server
    socket.emit('report_incident', incident);

    // Show Custom Toast Notification
    const toast = document.getElementById('customToast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);

    // Reset the form
    this.reset();
};

// Listen for new incidents (Live Feed)
socket.on('incident_received', function (data) {
    const feed = document.getElementById('feed');
    const item = document.createElement('div');

    item.id = data.id;
    item.className = "list-group-item";
    item.innerHTML = `
        <div>
            <div style="font-weight: 600; color: #1e293b;">${data.type} at ${data.location}</div>
            <div style="font-size: 0.9rem; color: #64748b; margin-top: 4px;">${data.description}</div>
        </div>
        <span class="status-badge">${data.status}</span>
    `;

    feed.prepend(item); // Newest reports appear at the top
});

// Update status if Admin changes it
socket.on('incident_status_updated', function (data) {
    const item = document.getElementById(data.id);
    if (item) {
        const badge = item.querySelector(".status-badge");
        badge.textContent = data.status;

        // Change badge color based on status
        if (data.status === 'In Progress') badge.style.background = '#dbeafe';
        if (data.status === 'Resolved') badge.style.background = '#dcfce7';
    }
});