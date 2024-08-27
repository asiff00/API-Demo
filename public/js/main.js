let token = localStorage.getItem('token');

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

async function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            alert('Signup successful. Please login.');
            showLogin();
        } else {
            const data = await response.json();
            alert(`Signup failed: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            localStorage.setItem('token', token);
            showDashboard();
        } else {
            const data = await response.json();
            alert(`Login failed: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

function logout() {
    token = null;
    localStorage.removeItem('token');
    document.getElementById('dashboard').classList.add('hidden');
    showLogin();
}

async function createApiKey() {
    try {
        const response = await fetch('/api/create-api-key', {
            method: 'POST',
            headers: {'x-access-token': token}
        });

        if (response.ok) {
            const data = await response.json();
            alert(`New API Key created: ${data.apiKey}`);
            showDashboard();
        } else {
            const data = await response.json();
            alert(`Failed to create API key: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

async function showDashboard() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    try {
        const response = await fetch('/api/user-data', {
            headers: {'x-access-token': token}
        });

        if (response.ok) {
            const data = await response.json();
            updateApiKeysTable(data.apiKeys);
            updateLogsTable(data.logs);
        } else {
            const data = await response.json();
            alert(`Failed to fetch user data: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

function updateApiKeysTable(apiKeys) {
    const tableBody = document.querySelector('#apiKeysTable tbody');
    tableBody.innerHTML = '';
    apiKeys.forEach(key => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = key.key;
        row.insertCell(1).textContent = new Date(key.createdAt).toLocaleString();
    });
}

function updateLogsTable(logs) {
    const tableBody = document.querySelector('#logsTable tbody');
    tableBody.innerHTML = '';
    logs.forEach(log => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = log.apiKey;
        row.insertCell(1).textContent = log.endpoint;
        row.insertCell(2).textContent = new Date(log.timestamp).toLocaleString();
    });
}

if (token) {
    showDashboard();
}