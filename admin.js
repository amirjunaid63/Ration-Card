// Admin Login System
let bookings = [];
let currentFilter = 'all';
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = '';
let sortDirection = 'asc';
let searchTerm = '';
let dateFilter = '';

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
    // Load bookings from localStorage
    loadBookings();
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
    
    // Setup form listeners
    document.getElementById('adminLoginForm').addEventListener('submit', handleLogin);
    
    // Close modal when clicking outside
    document.getElementById('bookingModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});

// Handle admin login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Initialize API service
    const apiService = new ApiService();
    
    // Verify login with database
    apiService.verifyAdminLogin(username, password).then(result => {
        if (result.success) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
            showNotification('Login successful!', 'success');
            loadBookingsFromDatabase();
        } else {
            // Fallback to simple authentication for demo
            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                showDashboard();
                showNotification('Login successful!', 'success');
                loadBookingsFromDatabase();
            } else {
                showNotification('Invalid username or password', 'error');
            }
        }
    });
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';
    updateStatistics();
    renderBookings();
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
    showNotification('Logged out successfully', 'info');
}

// Load bookings from database
function loadBookingsFromDatabase() {
    const apiService = new ApiService();
    
    apiService.getAllBookings().then(result => {
        if (result.success) {
            bookings = result.data;
            console.log('Loaded bookings from database:', bookings.length, 'bookings');
            updateStatistics();
            renderBookings();
        } else {
            console.error('Failed to load bookings from database:', result.message);
            // Fallback to localStorage
            loadBookings();
        }
    });
}

// Load bookings from localStorage (fallback)
function loadBookings() {
    const storedBookings = localStorage.getItem('carWashBookings');
    if (storedBookings) {
        bookings = JSON.parse(storedBookings);
        console.log('Loaded bookings from localStorage:', bookings.length, 'bookings');
    } else {
        // Sample data for demonstration
        bookings = [
            {
                id: 'BK001',
                name: 'Raj Kumar',
                email: 'raj.kumar@email.com',
                phone: '+91 98765 43210',
                service: 'Premium Wash - ₹599',
                date: '2026-02-16',
                time: '10:00',
                status: 'confirmed',
                message: 'Please clean the interior thoroughly.',
                createdAt: new Date().toISOString()
            },
            {
                id: 'BK002',
                name: 'Priya Sharma',
                email: 'priya.sharma@email.com',
                phone: '+91 87654 32109',
                service: 'Basic Wash - ₹299',
                date: '2026-02-16',
                time: '14:00',
                status: 'pending',
                message: '',
                createdAt: new Date().toISOString()
            },
            {
                id: 'BK003',
                name: 'Amit Patel',
                email: 'amit.patel@email.com',
                phone: '+91 76543 21098',
                service: '3D Wheel Alignment - ₹899',
                date: '2026-02-15',
                time: '11:00',
                status: 'completed',
                message: 'Check tire pressure as well.',
                createdAt: new Date().toISOString()
            }
        ];
        saveBookings();
        console.log('Created sample bookings:', bookings.length, 'bookings');
    }
}

// Save bookings to localStorage
function saveBookings() {
    localStorage.setItem('carWashBookings', JSON.stringify(bookings));
}

// Update statistics
function updateStatistics() {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    
    document.getElementById('totalBookings').textContent = total;
    document.getElementById('pendingBookings').textContent = pending;
    document.getElementById('confirmedBookings').textContent = confirmed;
    document.getElementById('completedBookings').textContent = completed;
}

// Render bookings table
function renderBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    // Filter bookings
    let filteredBookings = bookings.filter(booking => {
        // Status filter
        if (currentFilter !== 'all' && booking.status !== currentFilter) {
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                booking.id.toLowerCase().includes(searchLower) ||
                booking.name.toLowerCase().includes(searchLower) ||
                booking.email.toLowerCase().includes(searchLower) ||
                booking.phone.toLowerCase().includes(searchLower) ||
                booking.service.toLowerCase().includes(searchLower)
            );
        }
        
        // Date filter
        if (dateFilter) {
            return booking.date === dateFilter;
        }
        
        return true;
    });
    
    // Sort bookings
    if (sortColumn) {
        filteredBookings.sort((a, b) => {
            let aVal = a[sortColumn];
            let bVal = b[sortColumn];
            
            if (sortColumn === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    } else {
        // Default sort by creation date (newest first)
        filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Pagination
    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    if (paginatedBookings.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = paginatedBookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.service}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${formatTime(booking.time)}</td>
            <td>${booking.phone}</td>
            <td>
                <span class="booking-status status-${booking.status}">
                    ${capitalizeFirst(booking.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="viewBooking('${booking.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn btn-edit" onclick="editBooking('${booking.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${getActionButtons(booking)}
                </div>
            </td>
        </tr>
    `).join('');
    
    // Render pagination
    renderPagination(totalPages, currentPage);
}

// Get action buttons based on status
function getActionButtons(booking) {
    let buttons = '';
    
    if (booking.status === 'pending') {
        buttons += `
            <button class="action-btn btn-confirm" onclick="updateBookingStatus('${booking.id}', 'confirmed')">
                <i class="fas fa-check"></i> Confirm
            </button>
            <button class="action-btn btn-cancel" onclick="updateBookingStatus('${booking.id}', 'cancelled')">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    } else if (booking.status === 'confirmed') {
        buttons += `
            <button class="action-btn btn-complete" onclick="updateBookingStatus('${booking.id}', 'completed')">
                <i class="fas fa-check-double"></i> Complete
            </button>
            <button class="action-btn btn-cancel" onclick="updateBookingStatus('${booking.id}', 'cancelled')">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    }
    
    return buttons;
}

// Update booking status
function updateBookingStatus(bookingId, newStatus) {
    const apiService = new ApiService();
    
    // Update in database
    apiService.updateBookingStatus(bookingId, newStatus).then(result => {
        if (result.success) {
            console.log('Booking status updated in database:', bookingId, newStatus);
            
            // Update local data
            const booking = bookings.find(b => b.id === bookingId);
            if (booking) {
                booking.status = newStatus;
                updateStatistics();
                renderBookings();
                showNotification(`Booking ${bookingId} marked as ${newStatus}`, 'success');
            }
        } else {
            console.error('Failed to update booking status in database:', result.message);
            // Fallback to localStorage update
            const booking = bookings.find(b => b.id === bookingId);
            if (booking) {
                booking.status = newStatus;
                saveBookings();
                updateStatistics();
                renderBookings();
                showNotification(`Booking ${bookingId} marked as ${newStatus}`, 'success');
            }
        }
    });
}

// View booking details
function viewBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${booking.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${booking.name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${booking.email}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${booking.phone}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Service:</span>
            <span class="detail-value">${booking.service}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${formatDate(booking.date)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">${formatTime(booking.time)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
                <span class="booking-status status-${booking.status}">
                    ${capitalizeFirst(booking.status)}
                </span>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Message:</span>
            <span class="detail-value">${booking.message || 'No message provided'}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Booked On:</span>
            <span class="detail-value">${formatDateTime(booking.createdAt)}</span>
        </div>
    `;
    
    document.getElementById('bookingModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Filter bookings
function filterBookings(filter) {
    currentFilter = filter;
    currentPage = 1; // Reset to first page
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderBookings();
}

// Search bookings
function searchBookings() {
    searchTerm = document.getElementById('searchInput').value;
    currentPage = 1; // Reset to first page
    renderBookings();
}

// Filter by date
function filterByDate() {
    dateFilter = document.getElementById('dateFilter').value;
    currentPage = 1; // Reset to first page
    renderBookings();
}

// Sort table
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    renderBookings();
}

// Render pagination
function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderBookings();
    }
}

// Export bookings to CSV
function exportBookings() {
    const filteredBookings = bookings.filter(booking => {
        if (currentFilter !== 'all' && booking.status !== currentFilter) {
            return false;
        }
        return true;
    });
    
    if (filteredBookings.length === 0) {
        showNotification('No bookings to export', 'error');
        return;
    }
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Message', 'Created At'];
    const csvContent = [
        headers.join(','),
        ...filteredBookings.map(booking => [
            booking.id,
            `"${booking.name}"`,
            `"${booking.email}"`,
            `"${booking.phone}"`,
            `"${booking.service}"`,
            booking.date,
            booking.time,
            booking.status,
            `"${booking.message || ''}"`,
            booking.createdAt
        ].join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Bookings exported successfully', 'success');
}

// Edit booking
function editBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // For now, just show the booking details in modal
    // In a real application, this would open an edit form
    viewBooking(bookingId);
    showNotification('Edit functionality coming soon', 'info');
}

// Print booking details
function printBooking() {
    const modalContent = document.querySelector('.modal-content').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Booking Details - Hind Car Wash</title>
            <style>
                body { font-family: 'Poppins', sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .details { margin-bottom: 20px; }
                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                .label { font-weight: 600; color: #666; }
                .value { color: #333; }
                .status { padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
                .status-pending { background: #fef3c7; color: #92400e; }
                .status-confirmed { background: #d1fae5; color: #065f46; }
                .status-completed { background: #dbeafe; color: #1e40af; }
                .status-cancelled { background: #fee2e2; color: #991b1b; }
                @media print { body { padding: 10px; } }
            </style>
        </head>
        <body>
            ${modalContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Function to add new booking (called from main website)
function addNewBooking(bookingData) {
    // Check if booking already exists
    const existingBooking = bookings.find(b => b.id === bookingData.id);
    if (existingBooking) {
        console.log('Booking already exists:', bookingData.id);
        return;
    }
    
    // Ensure booking has required fields
    const completeBookingData = {
        id: bookingData.id || 'BK' + String(Date.now()).slice(-6),
        name: bookingData.name || 'Unknown',
        email: bookingData.email || 'unknown@email.com',
        phone: bookingData.phone || '0000000000',
        service: bookingData.service || 'Unknown Service',
        date: bookingData.date || new Date().toISOString().split('T')[0],
        time: bookingData.time || '09:00',
        status: bookingData.status || 'pending',
        message: bookingData.message || '',
        createdAt: bookingData.createdAt || new Date().toISOString()
    };
    
    bookings.push(completeBookingData);
    saveBookings();
    
    // Update dashboard if it's open
    if (document.getElementById('dashboardPage').style.display !== 'none') {
        updateStatistics();
        renderBookings();
        
        // Show notification for new booking
        showNotification(`New booking received: ${completeBookingData.id} - ${completeBookingData.name}`, 'success', 5000);
    }
    
    console.log('New booking added to admin panel:', completeBookingData);
    return completeBookingData.id;
}

// Listen for new bookings from main website
window.addEventListener('storage', function(e) {
    if (e.key === 'newBooking') {
        const bookingData = JSON.parse(e.newValue);
        addNewBooking(bookingData);
    }
});

// Listen for postMessage from main website
window.addEventListener('message', function(e) {
    if (e.data.type === 'newBooking') {
        addNewBooking(e.data.data);
    }
});

// Check for new bookings periodically (backup method)
setInterval(function() {
    const newBooking = localStorage.getItem('newBooking');
    if (newBooking) {
        const bookingData = JSON.parse(newBooking);
        const existingBooking = bookings.find(b => b.id === bookingData.id);
        if (!existingBooking) {
            addNewBooking(bookingData);
        }
        // Clear the new booking flag after processing
        localStorage.removeItem('newBooking');
    }
}, 2000);

console.log('Admin panel loaded successfully!');
