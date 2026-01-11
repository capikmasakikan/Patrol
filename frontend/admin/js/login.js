// API Configuration
const API_URL = 'http://localhost:9090';

// Setup on page load
document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
});

// Setup login form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            console.log('Login successful:', data);
            
            // Store admin info in sessionStorage
            sessionStorage.setItem('adminId', data.user.userId);
            sessionStorage.setItem('adminUsername', data.user.username);
            sessionStorage.setItem('adminFullName', data.user.fullName);
            sessionStorage.setItem('adminRole', data.user.role);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Login failed
            showError(data.error || 'Invalid username or password');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login to Dashboard';
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Connection error. Please check if the backend is running.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login to Dashboard';
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}