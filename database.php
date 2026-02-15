<?php
// Database Configuration
class Database {
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "hind_car_wash";
    private $conn;
    
    // Create connection
    public function __construct() {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->dbname);
        
        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
        
        // Create database and tables if they don't exist
        $this->initializeDatabase();
    }
    
    // Initialize database and create tables
    private function initializeDatabase() {
        // Create bookings table
        $sql = "CREATE TABLE IF NOT EXISTS bookings (
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
        )";
        
        if (!$this->conn->query($sql)) {
            echo "Error creating table: " . $this->conn->error;
        }
        
        // Create admin users table
        $sql = "CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        if (!$this->conn->query($sql)) {
            echo "Error creating admin table: " . $this->conn->error;
        }
        
        // Insert default admin user if not exists
        $sql = "INSERT IGNORE INTO admin_users (username, password) VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')";
        $this->conn->query($sql);
    }
    
    // Get connection
    public function getConnection() {
        return $this->conn;
    }
    
    // Close connection
    public function close() {
        $this->conn->close();
    }
    
    // Create new booking
    public function createBooking($data) {
        $sql = "INSERT INTO bookings (id, name, email, phone, service, date, time, message) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssss", 
            $data['id'], 
            $data['name'], 
            $data['email'], 
            $data['phone'], 
            $data['service'], 
            $data['date'], 
            $data['time'], 
            $data['message']
        );
        
        return $stmt->execute();
    }
    
    // Get all bookings
    public function getAllBookings() {
        $sql = "SELECT * FROM bookings ORDER BY created_at DESC";
        $result = $this->conn->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    
    // Get booking by ID
    public function getBookingById($id) {
        $sql = "SELECT * FROM bookings WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
    
    // Update booking status
    public function updateBookingStatus($id, $status) {
        $sql = "UPDATE bookings SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $status, $id);
        return $stmt->execute();
    }
    
    // Delete booking
    public function deleteBooking($id) {
        $sql = "DELETE FROM bookings WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $id);
        return $stmt->execute();
    }
    
    // Get booking statistics
    public function getBookingStats() {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
                FROM bookings";
        $result = $this->conn->query($sql);
        return $result->fetch_assoc();
    }
    
    // Verify admin login
    public function verifyAdmin($username, $password) {
        $sql = "SELECT password FROM admin_users WHERE username = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return password_verify($password, $row['password']);
        }
        return false;
    }
    
    // Search bookings
    public function searchBookings($searchTerm, $status = 'all', $date = '') {
        $sql = "SELECT * FROM bookings WHERE 1=1";
        $params = [];
        $types = "";
        
        if (!empty($searchTerm)) {
            $sql .= " AND (id LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ?)";
            $searchPattern = "%" . $searchTerm . "%";
            $params = array_merge($params, [$searchPattern, $searchPattern, $searchPattern, $searchPattern, $searchPattern]);
            $types .= "sssss";
        }
        
        if ($status !== 'all') {
            $sql .= " AND status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        if (!empty($date)) {
            $sql .= " AND date = ?";
            $params[] = $date;
            $types .= "s";
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}

// API endpoints for booking operations
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $database = new Database();
    
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'create_booking':
            $data = [
                'id' => $_POST['id'],
                'name' => $_POST['name'],
                'email' => $_POST['email'],
                'phone' => $_POST['phone'],
                'service' => $_POST['service'],
                'date' => $_POST['date'],
                'time' => $_POST['time'],
                'message' => $_POST['message'] ?? ''
            ];
            
            if ($database->createBooking($data)) {
                echo json_encode(['success' => true, 'message' => 'Booking created successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to create booking']);
            }
            break;
            
        case 'get_bookings':
            $bookings = $database->getAllBookings();
            echo json_encode(['success' => true, 'data' => $bookings]);
            break;
            
        case 'update_status':
            $id = $_POST['id'];
            $status = $_POST['status'];
            
            if ($database->updateBookingStatus($id, $status)) {
                echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update status']);
            }
            break;
            
        case 'delete_booking':
            $id = $_POST['id'];
            
            if ($database->deleteBooking($id)) {
                echo json_encode(['success' => true, 'message' => 'Booking deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to delete booking']);
            }
            break;
            
        case 'get_stats':
            $stats = $database->getBookingStats();
            echo json_encode(['success' => true, 'data' => $stats]);
            break;
            
        case 'admin_login':
            $username = $_POST['username'];
            $password = $_POST['password'];
            
            if ($database->verifyAdmin($username, $password)) {
                echo json_encode(['success' => true, 'message' => 'Login successful']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }
            break;
            
        case 'search_bookings':
            $searchTerm = $_POST['search_term'] ?? '';
            $status = $_POST['status'] ?? 'all';
            $date = $_POST['date'] ?? '';
            
            $bookings = $database->searchBookings($searchTerm, $status, $date);
            echo json_encode(['success' => true, 'data' => $bookings]);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
    
    $database->close();
}
?>
