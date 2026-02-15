# Hind Car Wash - Database Integration Guide

## Overview
The Hind Car Wash website now supports SQL database integration for storing and managing booking data. This provides a robust, scalable solution for handling customer bookings and administrative operations.

## Database Setup

### 1. Requirements
- MySQL/MariaDB server
- PHP 7.0 or higher
- Web server (Apache/Nginx)

### 2. Database Setup

#### Option A: Automatic Setup (Recommended)
1. Place all files in a web-accessible directory
2. Access `database.php` in your browser
3. The database and tables will be created automatically

#### Option B: Manual Setup
1. Create the database using the provided SQL script:
   ```bash
   mysql -u root -p < setup.sql
   ```

### 3. Database Configuration

Update `database.php` with your database credentials:
```php
private $host = "localhost";        // Your database host
private $username = "root";         // Your database username
private $password = "";             // Your database password
private $dbname = "hind_car_wash";  // Database name
```

## File Structure

```
Hind-Car-Wash/
├── index.html              # Main website
├── admin.html              # Admin dashboard
├── database.php            # Database connection and API
├── api.js                  # JavaScript API service
├── admin.js                # Admin panel functionality
├── script.js               # Main website functionality
├── styles.css              # Styling
├── setup.sql               # Database setup script
└── README-DATABASE.md      # This file
```

## Features

### Database Operations
- **Create Bookings**: Save new customer appointments
- **Read Bookings**: Retrieve all or filtered bookings
- **Update Status**: Change booking status (pending → confirmed → completed)
- **Delete Bookings**: Remove bookings from system
- **Search & Filter**: Advanced search capabilities
- **Statistics**: Real-time booking statistics

### Admin Dashboard
- **Secure Login**: Database-backed authentication
- **Real-time Updates**: Live booking notifications
- **Advanced Management**: Search, filter, sort, paginate
- **Export Functionality**: CSV export for records
- **Print Support**: Print booking details

### Customer Experience
- **Instant Confirmation**: Real-time booking confirmation
- **Unique Booking IDs**: Track appointments easily
- **Status Tracking**: Monitor booking progress
- **Professional Interface**: Modern, responsive design

## API Endpoints

The `database.php` file provides the following API endpoints:

### Booking Operations
- `POST database.php` with `action=create_booking`
- `POST database.php` with `action=get_bookings`
- `POST database.php` with `action=update_status`
- `POST database.php` with `action=delete_booking`
- `POST database.php` with `action=search_bookings`

### Admin Operations
- `POST database.php` with `action=admin_login`
- `POST database.php` with `action=get_stats`

## Database Schema

### bookings Table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(20) | Unique booking ID |
| name | VARCHAR(100) | Customer name |
| email | VARCHAR(100) | Customer email |
| phone | VARCHAR(20) | Customer phone |
| service | VARCHAR(100) | Service type |
| date | DATE | Booking date |
| time | TIME | Booking time |
| status | ENUM | Booking status |
| message | TEXT | Additional notes |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

### admin_users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Auto-increment ID |
| username | VARCHAR(50) | Admin username |
| password | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Account creation |

## Security Features

### Authentication
- Password hashing with PHP's `password_hash()`
- Secure session management
- SQL injection prevention with prepared statements

### Data Validation
- Input sanitization
- Type checking
- Error handling

### Fallback System
- If database fails, system falls back to localStorage
- Ensures no data loss during database issues
- Automatic sync when database is available

## Usage Instructions

### For Customers
1. Visit the main website
2. Select service and fill booking form
3. Receive instant confirmation with booking ID
4. Track booking status

### For Administrators
1. Access admin panel via footer link
2. Login with credentials (admin/admin123)
3. View and manage all bookings
4. Update booking statuses
5. Export data as needed

## Troubleshooting

### Common Issues

#### Database Connection Failed
- Check database credentials in `database.php`
- Ensure MySQL server is running
- Verify database exists

#### Bookings Not Saving
- Check PHP error logs
- Verify database permissions
- Test API endpoints directly

#### Admin Login Issues
- Verify admin user exists in database
- Check password hash
- Clear browser cache

### Debug Mode
Enable debug logging by checking browser console:
```javascript
// Look for these messages:
console.log('Booking saved to database successfully');
console.error('Failed to save booking to database:', result.message);
```

## Performance Optimization

### Database Indexes
The system includes indexes for:
- Booking status
- Booking dates
- Creation timestamps

### Caching
- LocalStorage fallback for offline operation
- Browser caching for static assets

### Scalability
- Prepared statements for security
- Efficient queries with proper indexing
- Pagination for large datasets

## Backup and Recovery

### Regular Backups
```bash
# Backup database
mysqldump -u root -p hind_car_wash > backup.sql

# Restore database
mysql -u root -p hind_car_wash < backup.sql
```

### Data Export
- Admin panel CSV export functionality
- Automatic backup recommendations

## Future Enhancements

### Planned Features
- Email notifications
- SMS reminders
- Payment integration
- Customer accounts
- Service scheduling
- Inventory management

### API Extensions
- RESTful API development
- Mobile app support
- Third-party integrations

## Support

For technical support:
1. Check browser console for errors
2. Verify database connection
3. Review PHP error logs
4. Test with sample data

## License

This database integration is part of the Hind Car Wash website project and follows the same licensing terms.
