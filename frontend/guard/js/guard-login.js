// API Configuration - CHANGE TO YOUR SPRING BOOT URL
const API_URL = 'http://localhost:9090';

// Load guards on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGuards();
    setupLoginForm();
});

// Load all guards into dropdown
async function loadGuards() {
    try {
        const response = await fetch(`${API_URL}/api/guards`);
        const guards = await response.json();
        
        const select = document.getElementById('guardId');
        select.innerHTML = '<option value="">Select your ID</option>';
        
        guards.forEach(guard => {
            const option = document.createElement('option');
            option.value = guard.guardId;
            option.textContent = `${guard.guardId} - ${guard.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading guards:', error);
        showError('Could not load guard list. Please check your connection.');
    }
}

// Setup login form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const guardId = document.getElementById('guardId').value;
    const pin = document.getElementById('pin').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    // Validate
    if (!guardId || !pin) {
        showError('Please select your ID and enter PIN');
        return;
    }
    
    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    errorMessage.style.display = 'none';
    
    try {
        // Verify PIN
        const response = await fetch(`${API_URL}/api/guards/verify-pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guardId: guardId,
                pin: pin
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            console.log('Login successful:', data);
            
            // Store guard info in sessionStorage
            sessionStorage.setItem('guardId', data.guard.guardId);
            sessionStorage.setItem('guardName', data.guard.name);
            sessionStorage.setItem('guardShift', data.guard.shift);
            
            // Redirect to scan page
            window.location.href = 'guard-scan.html';
        } else {
            // Login failed
            showError(data.error || 'Invalid PIN. Please try again.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Connection error. Please check if the backend is running.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}