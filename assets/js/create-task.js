document.addEventListener('DOMContentLoaded', () => {
    const createTaskForm = document.getElementById('createTaskForm');
    const taskClientSelect = document.getElementById('taskClient');
    const notification = document.getElementById('notification');

    // Populate clients dropdown
    function populateClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        taskClientSelect.innerHTML = '<option value="">Select Client</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            taskClientSelect.appendChild(option);
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

    // Handle form submission
    createTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
            id: `TASK-${Date.now()}`,
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            startDate: document.getElementById('taskStartDate').value,
            endDate: document.getElementById('taskEndDate').value,
            clientId: document.getElementById('taskClient').value,
            status: 'todo',
            priority: 'medium',
            assignee: '',
            created: new Date().toISOString(),
        };

        // Validate dates
        if (new Date(task.startDate) > new Date(task.endDate)) {
            showNotification('End date must be after start date', 'error');
            return;
        }

        // Save task to localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        showNotification('Task created successfully', 'success');
        setTimeout(() => {
            window.location.href = 'admin-tasks.html';
        }, 1000);
    });

    // Initialize
    populateClients();
});