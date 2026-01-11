// API Configuration
const API_URL = 'http://localhost:9090';

let guardId, guardName, guardShift;
let isScanning = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadGuardInfo();
    setupEventListeners();
    checkNFCSupport();
});

// Check if guard is logged in
function checkAuth() {
    guardId = sessionStorage.getItem('guardId');
    guardName = sessionStorage.getItem('guardName');
    guardShift = sessionStorage.getItem('guardShift');
    
    if (!guardId || !guardName) {
        // Not logged in, redirect to login
        window.location.href = 'guard-login.html';
    }
}

// Load guard info into page
function loadGuardInfo() {
    document.getElementById('guardName').textContent = `Welcome, ${guardName}`;
    document.getElementById('guardShift').textContent = `Shift: ${guardShift}`;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('scanBtn').addEventListener('click', handleScanClick);
    document.getElementById('manualBtn').addEventListener('click', handleManualEntry);
    document.getElementById('historyBtn').addEventListener('click', () => {
        window.location.href = 'guard-history.html';
    });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Check if Web NFC is supported
async function checkNFCSupport() {
    if ('NDEFReader' in window) {
        console.log('Web NFC is supported!');
        updateStatus('NFC Ready - Tap scan button to start');
    } else {
        console.log('Web NFC is not supported');
        updateStatus('NFC not supported - Use manual entry');
    }
}

// Handle scan button click
async function handleScanClick() {
    if (!('NDEFReader' in window)) {
        alert('Web NFC is not supported on this device/browser. Please use manual entry or use Chrome on Android.');
        return;
    }
    
    if (isScanning) {
        // Cancel scan
        cancelScan();
    } else {
        // Start scan
        await startNFCScan();
    }
}

// Start NFC scanning
async function startNFCScan() {
    try {
        isScanning = true;
        updateScanButton(true);
        updateStatus('Hold your phone near an NFC tag...');
        
        const ndef = new NDEFReader();
        await ndef.scan();
        
        console.log('NFC scan started successfully');
        
        ndef.addEventListener('reading', ({ message, serialNumber }) => {
            console.log('NFC tag detected!');
            console.log('Serial Number:', serialNumber);
            console.log('Message:', message);
            
            // Use serial number as tag ID
            const tagId = serialNumber;
            
            // Stop scanning
            cancelScan();
            
            // Record patrol
            recordPatrol(tagId);
        });
        
        ndef.addEventListener('readingerror', () => {
            console.error('Error reading NFC tag');
            updateStatus('Error reading tag. Please try again.');
            cancelScan();
        });
        
    } catch (error) {
        console.error('NFC Scan Error:', error);
        
        if (error.name === 'NotAllowedError') {
            alert('NFC permission denied. Please allow NFC access in your browser settings.');
        } else {
            alert('Could not start NFC scan: ' + error.message);
        }
        
        cancelScan();
    }
}

// Cancel NFC scan
function cancelScan() {
    isScanning = false;
    updateScanButton(false);
    updateStatus('NFC Ready - Tap scan button to start');
}

// Update scan button state
function updateScanButton(scanning) {
    const btn = document.getElementById('scanBtn');
    if (scanning) {
        btn.classList.add('scanning');
        btn.textContent = '⏹ CANCEL SCAN';
    } else {
        btn.classList.remove('scanning');
        btn.textContent = '🔍 SCAN NFC TAG';
    }
}

// Update status text
function updateStatus(message) {
    document.getElementById('statusText').textContent = message;
}

// Handle manual entry
async function handleManualEntry() {
    const tagId = document.getElementById('manualTagId').value.trim();
    
    if (!tagId) {
        alert('Please enter a checkpoint ID');
        return;
    }
    
    await recordPatrol(tagId);
    document.getElementById('manualTagId').value = '';
}

// Record patrol to backend
async function recordPatrol(nfcTagId) {
    try {
        updateStatus('Recording patrol...');
        
        const response = await fetch(`${API_URL}/api/patrols`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guard_id: guardId,
                nfc_tag_id: nfcTagId,
                notes: 'Scanned via web'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            updateStatus(' Patrol recorded successfully!');
            
            // Show success alert
            const now = new Date();
            alert(` Success!\n\nCheckpoint scanned successfully!\nTag: ${nfcTagId}\nTime: ${now.toLocaleTimeString()}`);
            
            // Clear status after 3 seconds
            setTimeout(() => {
                updateStatus('NFC Ready - Tap scan button to start');
            }, 3000);
            
        } else {
            // Error
            updateStatus(' Error recording patrol');
            alert(' Error: ' + (data.error || 'Could not record patrol'));
        }
        
    } catch (error) {
        console.error('Record patrol error:', error);
        updateStatus(' Connection error');
        alert(' Connection error. Please check if backend is running.');
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'guard-login.html';
    }
}