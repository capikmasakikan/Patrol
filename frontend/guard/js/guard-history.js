// API Configuration
const API_URL = 'http://localhost:9090';

let guardId, guardName;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadGuardInfo();
    loadPatrolHistory();
    setupEventListeners();
});

// Check if guard is logged in
function checkAuth() {
    guardId = sessionStorage.getItem('guardId');
    guardName = sessionStorage.getItem('guardName');
    
    if (!guardId || !guardName) {
        window.location.href = 'guard-login.html';
    }
}

// Load guard info
function loadGuardInfo() {
    document.getElementById('guardName').textContent = guardName;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'guard-scan.html';
    });
}

// Load patrol history
async function loadPatrolHistory() {
    try {
        const response = await fetch(`${API_URL}/api/patrols/guard/${guardId}`);
        const patrols = await response.json();
        
        console.log('Patrols loaded:', patrols);
        
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        if (patrols.length === 0) {
            // No patrols
            document.getElementById('noData').style.display = 'block';
            updateStats(0, 0);
        } else {
            // Display patrols
            displayPatrols(patrols);
            updateStats(patrols.length, getTodayCount(patrols));
        }
        
    } catch (error) {
        console.error('Error loading patrols:', error);
        document.getElementById('loading').style.display = 'none';
        alert('Could not load patrol history. Please check your connection.');
    }
}

// Display patrols
function displayPatrols(patrols) {
    const patrolList = document.getElementById('patrolList');
    patrolList.innerHTML = '';
    patrolList.style.display = 'block';
    
    patrols.forEach(patrol => {
        const card = createPatrolCard(patrol);
        patrolList.appendChild(card);
    });
}

// Create patrol card
function createPatrolCard(patrol) {
    const card = document.createElement('div');
    card.className = 'patrol-card';
    
    const scanTime = new Date(patrol.scanTime);
    const formattedDate = scanTime.toLocaleDateString();
    const formattedTime = scanTime.toLocaleTimeString();
    
    card.innerHTML = `
        <div class="patrol-header">
            <div class="checkpoint-name">${patrol.checkpoint.checkpointName}</div>
            <div class="scan-time">
                ${formattedDate}<br>
                ${formattedTime}
            </div>
        </div>
        <div class="patrol-details">
            <div class="detail-row">
                <span class="detail-label">Building:</span>
                <span class="detail-value">${patrol.checkpoint.building}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Floor:</span>
                <span class="detail-value">${patrol.checkpoint.floor}</span>
            </div>
            ${patrol.notes ? `
            <div class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${patrol.notes}</span>
            </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Update statistics
function updateStats(total, today) {
    document.getElementById('totalPatrols').textContent = total;
    document.getElementById('todayPatrols').textContent = today;
}

// Get count of today's patrols
function getTodayCount(patrols) {
    const today = new Date().toDateString();
    return patrols.filter(patrol => {
        const patrolDate = new Date(patrol.scanTime).toDateString();
        return patrolDate === today;
    }).length;
}