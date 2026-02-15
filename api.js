// API Service for Database Operations
class ApiService {
    constructor() {
        this.baseUrl = 'database.php';
    }
    
    // Create new booking
    async createBooking(bookingData) {
        try {
            const formData = new FormData();
            formData.append('action', 'create_booking');
            formData.append('id', bookingData.id);
            formData.append('name', bookingData.name);
            formData.append('email', bookingData.email);
            formData.append('phone', bookingData.phone);
            formData.append('service', bookingData.service);
            formData.append('date', bookingData.date);
            formData.append('time', bookingData.time);
            formData.append('message', bookingData.message || '');
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
    
    // Get all bookings
    async getAllBookings() {
        try {
            const formData = new FormData();
            formData.append('action', 'get_bookings');
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
    
    // Update booking status
    async updateBookingStatus(bookingId, status) {
        try {
            const formData = new FormData();
            formData.append('action', 'update_status');
            formData.append('id', bookingId);
            formData.append('status', status);
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating status:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
    
    // Delete booking
    async deleteBooking(bookingId) {
        try {
            const formData = new FormData();
            formData.append('action', 'delete_booking');
            formData.append('id', bookingId);
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting booking:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
    
    // Get booking statistics
    async getBookingStats() {
        try {
            const formData = new FormData();
            formData.append('action', 'get_stats');
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
    
    // Verify admin login
    async verifyAdminLogin(username, password) {
        try {
            const formData = new FormData();
            formData.append('action', 'admin_login');
            formData.append('username', username);
            formData.append('password', password);
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error verifying login:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
    
    // Search bookings
    async searchBookings(searchTerm, status = 'all', date = '') {
        try {
            const formData = new FormData();
            formData.append('action', 'search_bookings');
            formData.append('search_term', searchTerm);
            formData.append('status', status);
            formData.append('date', date);
            
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error searching bookings:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}
