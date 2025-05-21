document.addEventListener('DOMContentLoaded', () => {
    const clientsList = document.getElementById('clientsList');
    const createClientBtn = document.getElementById('createClientBtn');
    const clientFormContainer = document.getElementById('clientFormContainer');
    const clientForm = document.getElementById('clientForm');
    const cancelClientBtn = document.getElementById('cancelClientBtn');
    const notification = document.getElementById('notification');

    // Load clients from localStorage
    function loadClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientsList.innerHTML = '';
        if (clients.length === 0) {
            clientsList.innerHTML = `
                <tr class="empty-state">
                    <td colspan="4">
                        <i class="fas fa-users"></i>
                        <p>No clients available</p>
                    </td>
                </tr>
            `;
            return;
        }
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>
                    <button class="action-btn btn-edit" data-id="${client.id}">Edit</button>
                    <button class="action-btn btn-delete" data-id="${client.id}">Delete</button>
                </td>
            `;
            clientsList.appendChild(row);
        });
    }

    // Show notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Toggle form visibility
    createClientBtn.addEventListener('click', () => {
        clientFormContainer.classList.toggle('hidden');
        if (!clientFormContainer.classList.contains('hidden')) {
            clientForm.reset();
        }
    });

    // Cancel form
    cancelClientBtn.addEventListener('click', () => {
        clientFormContainer.classList.add('hidden');
        clientForm.reset();
    });

    // Handle form submission with validation
    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();

        if (!name) {
            showNotification('Name is required', 'error');
            return;
        }
        if (!email) {
            showNotification('Email is required', 'error');
            return;
        }

        const client = {
            id: `CLIENT-${Date.now()}`,
            name: name,
            email: email,
        };

        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push(client);
        localStorage.setItem('clients', JSON.stringify(clients));
        showNotification('Client created successfully', 'success');
        loadClients();
        clientFormContainer.classList.add('hidden');
        clientForm.reset();
    });

    // Handle edit and delete buttons
    clientsList.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        if (e.target.classList.contains('btn-edit')) {
            alert('Edit functionality not implemented yet. Use the form to create new clients for now.');
        } else if (e.target.classList.contains('btn-delete')) {
            if (confirm('Are you sure you want to delete this client?')) {
                const updatedClients = clients.filter(c => c.id !== id);
                localStorage.setItem('clients', JSON.stringify(updatedClients));
                loadClients();
                showNotification('Client deleted successfully', 'success');
            }
        }
    });

    // Initialize
    loadClients();
});