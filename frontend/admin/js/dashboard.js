// API Configuration
const API_URL = 'http://localhost:9090';

let adminUsername;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadAdminInfo();
    loadDashboardData();
    setupEventListeners();
});

// Check if admin is logged in
function checkAuth() {
    const adminId = sessionStorage.getItem('adminId');
    adminUsername = sessionStorage.getItem('adminUsername');
    
    if (!adminId || !adminUsername) {
        window.location.href = 'login.html';
    }
}

// Load admin info
function loadAdminInfo() {
    const fullName = sessionStorage.getItem('adminFullName') || adminUsername;
    document.getElementById('adminName').textContent = fullName;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', loadDashboardData);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Load all dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadStatistics(),
        loadRecentPatrols()
    ]);
}

// Load statistics
async function loadStatistics() {
    try {
        // Load guards
        const guardsResponse = await fetch(`${API_URL}/api/guards`);
        const guards = await guardsResponse.json();
        document.getElementById('totalGuards').textContent = guards.length;
        
        // Load checkpoints
        const checkpointsResponse = await fetch(`${API_URL}/api/checkpoints`);
        const checkpoints = await checkpointsResponse.json();
        document.getElementById('totalCheckpoints').textContent = checkpoints.length;
        
        // Load patrols
        const patrolsResponse = await fetch(`${API_URL}/api/patrols`);
        const patrols = await patrolsResponse.json();
        document.getElementById('totalPatrols').textContent = patrols.length;
        
        // Calculate today's patrols
        const today = new Date().toDateString();
        const todayPatrols = patrols.filter(patrol => {
            const patrolDate = new Date(patrol.scanTime).toDateString();
            return patrolDate === today;
        });
        document.getElementById('todayPatrols').textContent = todayPatrols.length;
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load recent patrols
async function loadRecentPatrols() {
    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('tableContainer').style.display = 'none';
        document.getElementById('noData').style.display = 'none';
        
        const response = await fetch(`${API_URL}/api/patrols`);
        const patrols = await response.json();
        
        document.getElementById('loading').style.display = 'none';
        
        if (patrols.length === 0) {
            document.getElementById('noData').style.display = 'block';
        } else {
            displayPatrols(patrols.slice(0, 10)); // Show only last 10
            document.getElementById('tableContainer').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading patrols:', error);
        document.getElementById('loading').style.display = 'none';
        alert('Error loading patrol data');
    }
}

// Display patrols in table
function displayPatrols(patrols) {
    const tbody = document.getElementById('patrolsTableBody');
    tbody.innerHTML = '';
    
    patrols.forEach(patrol => {
        const row = document.createElement('tr');
        const scanTime = new Date(patrol.scanTime);
        
        row.innerHTML = `
            <td>${patrol.patrolId}</td>
            <td><strong>${patrol.guard.name}</strong></td>
            <td>${patrol.checkpoint.checkpointName}</td>
            <td>${patrol.checkpoint.building}</td>
            <td>${patrol.checkpoint.floor}</td>
            <td>${scanTime.toLocaleString()}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}