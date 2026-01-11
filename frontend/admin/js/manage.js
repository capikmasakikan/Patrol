// API Configuration
const API_URL = 'http://localhost:9090';

let adminUsername;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadAdminInfo();
    loadGuards();
    loadCheckpoints();
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
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Add buttons
    document.getElementById('addGuardBtn').addEventListener('click', () => openGuardModal());
    document.getElementById('addCheckpointBtn').addEventListener('click', () => openCheckpointModal());
    
    // Form submissions
    document.getElementById('guardForm').addEventListener('submit', handleGuardSubmit);
    document.getElementById('checkpointForm').addEventListener('submit', handleCheckpointSubmit);
    
    // Modal close on outside click
    window.onclick = function(event) {
        const guardModal = document.getElementById('guardModal');
        const checkpointModal = document.getElementById('checkpointModal');
        
        if (event.target === guardModal) {
            closeGuardModal();
        }
        if (event.target === checkpointModal) {
            closeCheckpointModal();
        }
    };
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// ==================== GUARDS MANAGEMENT ====================

// Load all guards
async function loadGuards() {
    const loadingEl = document.getElementById('guardsLoading');
    const tableEl = document.getElementById('guardsTable');
    const tbody = document.getElementById('guardsTableBody');
    
    try {
        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        
        const response = await fetch(`${API_URL}/api/guards`);
        
        if (!response.ok) {
            throw new Error('Failed to load guards');
        }
        
        const guards = await response.json();
        
        tbody.innerHTML = '';
        
        if (guards.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No guards found</td></tr>';
        } else {
            guards.forEach(guard => {
                const row = createGuardRow(guard);
                tbody.appendChild(row);
            });
        }
        
        loadingEl.style.display = 'none';
        tableEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading guards:', error);
        loadingEl.textContent = 'Error loading guards. Please try again.';
        alert('Error loading guards');
    }
}

// Create guard table row
function createGuardRow(guard) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${guard.guardId}</td>
        <td>${guard.name}</td>
        <td>${guard.phone || 'N/A'}</td>
        <td>${guard.email || 'N/A'}</td>
        <td><span class="badge badge-${guard.shift.toLowerCase()}">${guard.shift}</span></td>
        <td class="actions">
            <button class="btn-edit" onclick="editGuard(${guard.guardId})">Edit</button>
            <button class="btn-delete" onclick="deleteGuard(${guard.guardId})">Delete</button>
        </td>
    `;
    return row;
}

// Open guard modal (for add or edit)
function openGuardModal(guard = null) {
    const modal = document.getElementById('guardModal');
    const form = document.getElementById('guardForm');
    const title = document.getElementById('guardModalTitle');
    
    form.reset();
    
    if (guard) {
        // Edit mode
        title.textContent = 'Edit Guard';
        document.getElementById('guardId').value = guard.guardId;
        document.getElementById('guardName').value = guard.name;
        document.getElementById('guardPhone').value = guard.phone || '';
        document.getElementById('guardEmail').value = guard.email || '';
        document.getElementById('guardShift').value = guard.shift;
        document.getElementById('guardPin').value = guard.pin || '';
    } else {
        // Add mode
        title.textContent = 'Add New Guard';
        document.getElementById('guardId').value = '';
    }
    
    modal.style.display = 'block';
}

// Close guard modal
function closeGuardModal() {
    document.getElementById('guardModal').style.display = 'none';
    document.getElementById('guardForm').reset();
}

// Handle guard form submission
async function handleGuardSubmit(e) {
    e.preventDefault();
    
    const guardId = document.getElementById('guardId').value;
    const guardData = {
        name: document.getElementById('guardName').value,
        phone: document.getElementById('guardPhone').value,
        email: document.getElementById('guardEmail').value,
        shift: document.getElementById('guardShift').value,
        pin: document.getElementById('guardPin').value
    };
    
    try {
        const url = guardId 
            ? `${API_URL}/api/guards/${guardId}` 
            : `${API_URL}/api/guards`;
        
        const method = guardId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(guardData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save guard');
        }
        
        alert(`Guard ${guardId ? 'updated' : 'added'} successfully`);
        closeGuardModal();
        loadGuards();
        
    } catch (error) {
        console.error('Error saving guard:', error);
        alert('Failed to save guard');
    }
}

// Edit guard
async function editGuard(guardId) {
    try {
        const response = await fetch(`${API_URL}/api/guards/${guardId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch guard details');
        }
        
        const guard = await response.json();
        openGuardModal(guard);
        
    } catch (error) {
        console.error('Error fetching guard:', error);
        alert('Failed to load guard details');
    }
}

// Delete guard
async function deleteGuard(guardId) {
    if (!confirm('Are you sure you want to delete this guard?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/guards/${guardId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete guard');
        }
        
        alert('Guard deleted successfully');
        loadGuards();
        
    } catch (error) {
        console.error('Error deleting guard:', error);
        alert('Failed to delete guard');
    }
}

// ==================== CHECKPOINTS MANAGEMENT ====================

// Load all checkpoints
async function loadCheckpoints() {
    const loadingEl = document.getElementById('checkpointsLoading');
    const tableEl = document.getElementById('checkpointsTable');
    const tbody = document.getElementById('checkpointsTableBody');
    
    try {
        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        
        const response = await fetch(`${API_URL}/api/checkpoints`);
        
        if (!response.ok) {
            throw new Error('Failed to load checkpoints');
        }
        
        const checkpoints = await response.json();
        
        tbody.innerHTML = '';
        
        if (checkpoints.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No checkpoints found</td></tr>';
        } else {
            checkpoints.forEach(checkpoint => {
                const row = createCheckpointRow(checkpoint);
                tbody.appendChild(row);
            });
        }
        
        loadingEl.style.display = 'none';
        tableEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading checkpoints:', error);
        loadingEl.textContent = 'Error loading checkpoints. Please try again.';
        alert('Error loading checkpoints');
    }
}

// Create checkpoint table row
function createCheckpointRow(checkpoint) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${checkpoint.checkpointId}</td>
        <td><span class="nfc-tag">${checkpoint.nfcTagId}</span></td>
        <td>${checkpoint.checkpointName}</td>
        <td>${checkpoint.building}</td>
        <td>${checkpoint.floor}</td>
        <td class="actions">
            <button class="btn-edit" onclick="editCheckpoint(${checkpoint.checkpointId})">Edit</button>
            <button class="btn-delete" onclick="deleteCheckpoint(${checkpoint.checkpointId})">Delete</button>
        </td>
    `;
    return row;
}

// Open checkpoint modal (for add or edit)
function openCheckpointModal(checkpoint = null) {
    const modal = document.getElementById('checkpointModal');
    const form = document.getElementById('checkpointForm');
    const title = document.getElementById('checkpointModalTitle');
    
    form.reset();
    
    if (checkpoint) {
        // Edit mode
        title.textContent = 'Edit Checkpoint';
        document.getElementById('checkpointId').value = checkpoint.checkpointId;
        document.getElementById('nfcTagId').value = checkpoint.nfcTagId;
        document.getElementById('checkpointName').value = checkpoint.checkpointName;
        document.getElementById('building').value = checkpoint.building;
        document.getElementById('floor').value = checkpoint.floor;
        document.getElementById('description').value = checkpoint.description || '';
    } else {
        // Add mode
        title.textContent = 'Add New Checkpoint';
        document.getElementById('checkpointId').value = '';
    }
    
    modal.style.display = 'block';
}

// Close checkpoint modal
function closeCheckpointModal() {
    document.getElementById('checkpointModal').style.display = 'none';
    document.getElementById('checkpointForm').reset();
}

// Handle checkpoint form submission
async function handleCheckpointSubmit(e) {
    e.preventDefault();
    
    const checkpointId = document.getElementById('checkpointId').value;
    const checkpointData = {
        nfcTagId: document.getElementById('nfcTagId').value,
        checkpointName: document.getElementById('checkpointName').value,
        building: document.getElementById('building').value,
        floor: document.getElementById('floor').value,
        description: document.getElementById('description').value
    };
    
    try {
        const url = checkpointId 
            ? `${API_URL}/api/checkpoints/${checkpointId}` 
            : `${API_URL}/api/checkpoints`;
        
        const method = checkpointId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkpointData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save checkpoint');
        }
        
        alert(`Checkpoint ${checkpointId ? 'updated' : 'added'} successfully`);
        closeCheckpointModal();
        loadCheckpoints();
        
    } catch (error) {
        console.error('Error saving checkpoint:', error);
        alert('Failed to save checkpoint');
    }
}

// Edit checkpoint
async function editCheckpoint(checkpointId) {
    try {
        const response = await fetch(`${API_URL}/api/checkpoints/${checkpointId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch checkpoint details');
        }
        
        const checkpoint = await response.json();
        openCheckpointModal(checkpoint);
        
    } catch (error) {
        console.error('Error fetching checkpoint:', error);
        alert('Failed to load checkpoint details');
    }
}

// Delete checkpoint
async function deleteCheckpoint(checkpointId) {
    if (!confirm('Are you sure you want to delete this checkpoint?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/checkpoints/${checkpointId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete checkpoint');
        }
        
        alert('Checkpoint deleted successfully');
        loadCheckpoints();
        
    } catch (error) {
        console.error('Error deleting checkpoint:', error);
        alert('Failed to delete checkpoint');
    }
}