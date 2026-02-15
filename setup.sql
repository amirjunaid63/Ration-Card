-- Hind Car Wash Database Setup Script
-- Run this script in MySQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS hind_car_wash;
USE hind_car_wash;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO admin_users (username, password) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample bookings (optional)
INSERT IGNORE INTO bookings (id, name, email, phone, service, date, time, status, message) VALUES 
('BK001', 'Raj Kumar', 'raj.kumar@email.com', '+91 98765 43210', 'Premium Wash - ₹599', '2026-02-16', '10:00:00', 'confirmed', 'Please clean the interior thoroughly.'),
('BK002', 'Priya Sharma', 'priya.sharma@email.com', '+91 87654 32109', 'Basic Wash - ₹299', '2026-02-16', '14:00:00', 'pending', ''),
('BK003', 'Amit Patel', 'amit.patel@email.com', '+91 76543 21098', '3D Wheel Alignment - ₹899', '2026-02-15', '11:00:00', 'completed', 'Check tire pressure as well.');

-- Create indexes for better performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON hind_car_wash.* TO 'carwash_user'@'localhost' IDENTIFIED BY 'your_password';
-- FLUSH PRIVILEGES;

SELECT 'Database setup completed successfully!' as message;
