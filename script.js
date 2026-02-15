// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .about-text, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Booking Form Handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const bookingData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateBookingForm(bookingData)) {
        return;
    }
    
    // Show success message
    showBookingSuccess(bookingData);
    
    // Reset form
    this.reset();
});

function validateBookingForm(data) {
    if (!data.name || !data.email || !data.phone || !data.service || !data.date || !data.time) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Validate date (not in the past)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date', 'error');
        return false;
    }
    
    return true;
}

function showBookingSuccess(data) {
    const serviceNames = {
        'basic': 'Basic Wash - ₹299',
        'premium': 'Premium Wash - ₹599',
        'deluxe': 'Deluxe Detail - ₹1299',
        'alignment': '3D Wheel Alignment - ₹899'
    };
    
    // Generate booking ID
    const bookingId = 'BK' + String(Date.now()).slice(-6);
    
    // Save booking to localStorage for admin panel
    const bookingData = {
        id: bookingId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: serviceNames[data.service],
        date: data.date,
        time: data.time,
        status: 'pending',
        message: data.message || '',
        createdAt: new Date().toISOString()
    };
    
    // Initialize API service
    const apiService = new ApiService();
    
    // Save to database
    apiService.createBooking(bookingData).then(result => {
        if (result.success) {
            console.log('Booking saved to database successfully');
        } else {
            console.error('Failed to save booking to database:', result.message);
            // Fallback to localStorage if database fails
            let existingBookings = JSON.parse(localStorage.getItem('carWashBookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('carWashBookings', JSON.stringify(existingBookings));
        }
    });
    
    // Get existing bookings or create new array (fallback)
    let existingBookings = JSON.parse(localStorage.getItem('carWashBookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('carWashBookings', JSON.stringify(existingBookings));
    
    // Trigger storage event for admin panel if it's open
    if (window.opener || window.parent !== window) {
        window.parent.postMessage({
            type: 'newBooking',
            data: bookingData
        }, '*');
    }
    
    // Store in localStorage for admin to retrieve
    localStorage.setItem('newBooking', JSON.stringify(bookingData));
    
    // Trigger storage event for admin panel
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'newBooking',
        newValue: JSON.stringify(bookingData)
    }));
    
    // Show enhanced success message with booking ID
    const message = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #10b981; margin-bottom: 1rem;">Booking Confirmed!</h3>
            <div style="background: #f0fdf4; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #10b981;">
                <p style="margin: 0; font-weight: 600; color: #065f46;">Booking ID: <span style="font-family: monospace; font-size: 1.1rem;">${bookingId}</span></p>
            </div>
            <div style="text-align: left; margin: 1.5rem 0;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Service:</strong> ${serviceNames[data.service]}</p>
                <p><strong>Date:</strong> ${formatDate(data.date)}</p>
                <p><strong>Time:</strong> ${formatTime(data.time)}</p>
                ${data.message ? `<p><strong>Notes:</strong> ${data.message}</p>` : ''}
            </div>
            <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; margin-top: 1rem; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                    <i class="fas fa-info-circle"></i> <strong>Status:</strong> Your booking is <strong>Pending</strong>. We will confirm your appointment shortly.
                </p>
            </div>
            <p style="margin-top: 1.5rem; color: #666;">
                <i class="fas fa-envelope"></i> A confirmation email has been sent to your registered email address.
            </p>
        </div>
    `;
    
    showNotification(message, 'success', 8000);
    
    // Reset form after successful booking
    document.getElementById('bookingForm').reset();
    
    // Show booking summary in console for debugging
    console.log('New booking created:', bookingData);
}

// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const contactData = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        message: this.querySelector('textarea').value
    };
    
    // Validate form
    if (!contactData.name || !contactData.email || !contactData.message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    
    // Reset form
    this.reset();
});

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
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
    }, duration);
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

// Utility Functions
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Set minimum date for booking (today)
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});

// Pricing Card Click Handlers
document.querySelectorAll('.pricing-card button').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.pricing-card');
        const serviceName = card.querySelector('h3').textContent;
        const servicePrice = card.querySelector('.amount').textContent;
        
        // Scroll to booking section
        scrollToSection('booking');
        
        // Pre-select the service
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                const serviceMap = {
                    'Basic Wash': 'basic',
                    'Premium Wash': 'premium',
                    'Deluxe Detail': 'deluxe',
                    '3D Wheel Alignment': 'alignment'
                };
                
                serviceSelect.value = serviceMap[serviceName] || '';
                
                // Highlight the selected service
                serviceSelect.style.borderColor = '#10b981';
                setTimeout(() => {
                    serviceSelect.style.borderColor = '';
                }, 2000);
            }
        }, 500);
        
        // Show notification
        showNotification(`Selected ${serviceName} - ₹${servicePrice}. Please complete the booking form below.`, 'info', 4000);
    });
});

// Service Card Click Handlers
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3').textContent;
        
        // Scroll to pricing section
        scrollToSection('pricing');
        
        // Show notification
        showNotification(`View pricing for ${serviceName} below.`, 'info', 3000);
    });
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.cursor = 'pointer';
});

// Lazy Loading for Images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll event
window.addEventListener('scroll', debounce(() => {
    // Add any scroll-based animations here
}, 100));

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type === 'submit') {
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

console.log('Hind Car Wash website loaded successfully!');
