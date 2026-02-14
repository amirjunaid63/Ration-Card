// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navUl = document.querySelector('.nav ul');

mobileMenuBtn.addEventListener('click', () => {
    navUl.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navUl.classList.remove('active');
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// Modal Functions
function showApplicationForm() {
    document.getElementById('applicationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('applicationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function checkStatus() {
    document.getElementById('statusModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeStatusModal() {
    document.getElementById('statusModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close Modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Application Form Submission
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('applicantName').value,
        aadhar: document.getElementById('aadhar').value,
        category: document.getElementById('category').value,
        address: document.getElementById('address').value,
        income: document.getElementById('income').value
    };

    // Validate Aadhar number (12 digits)
    if (!/^\d{12}$/.test(formData.aadhar)) {
        showNotification('Please enter a valid 12-digit Aadhar number', 'error');
        return;
    }

    // Simulate application submission
    const applicationId = 'APP' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Store application data (in real app, this would be sent to server)
    localStorage.setItem(`application_${applicationId}`, JSON.stringify({
        ...formData,
        applicationId: applicationId,
        submittedDate: new Date().toISOString(),
        status: 'pending'
    }));

    showNotification(`Application submitted successfully! Your Application ID is: ${applicationId}`, 'success');
    
    // Reset form and close modal
    this.reset();
    closeModal();
});

// Status Check Form Submission
document.getElementById('statusForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const applicationId = document.getElementById('applicationId').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const statusResult = document.getElementById('statusResult');

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
        showNotification('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    // Retrieve application data
    const applicationData = localStorage.getItem(`application_${applicationId}`);
    
    if (applicationData) {
        const data = JSON.parse(applicationData);
        const submittedDate = new Date(data.submittedDate).toLocaleDateString();
        const statusMessages = {
            'pending': 'Your application is under review',
            'approved': 'Your application has been approved',
            'rejected': 'Your application has been rejected',
            'processing': 'Your application is being processed'
        };
        
        statusResult.innerHTML = `
            <h4>Application Status</h4>
            <p><strong>Application ID:</strong> ${data.applicationId}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Category:</strong> ${data.category.toUpperCase()}</p>
            <p><strong>Submitted Date:</strong> ${submittedDate}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${data.status}">${statusMessages[data.status]}</span></p>
        `;
        statusResult.className = 'status-result success';
        statusResult.style.display = 'block';
    } else {
        statusResult.innerHTML = '<p>No application found with this Application ID. Please check your Application ID and try again.</p>';
        statusResult.className = 'status-result error';
        statusResult.style.display = 'block';
    }
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Validate phone if provided
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        showNotification('Please enter a valid 10-digit phone number', 'error');
        return;
    }

    // Simulate form submission
    showNotification('Your message has been sent successfully! We will get back to you soon.', 'success');
    
    // Reset form
    this.reset();
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideInRight 0.3s ease;
    `;

    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .status-pending {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-approved {
        background: #d4edda;
        color: #155724;
    }
    
    .status-rejected {
        background: #f8d7da;
        color: #721c24;
    }
    
    .status-processing {
        background: #d1ecf1;
        color: #0c5460;
    }
`;
document.head.appendChild(style);

// Form Input Validation
document.getElementById('aadhar').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').slice(0, 12);
});

document.getElementById('mobileNumber').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

document.getElementById('phone').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

document.getElementById('income').addEventListener('input', function(e) {
    if (this.value < 0) {
        this.value = 0;
    }
});

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

document.body.appendChild(scrollToTopBtn);

// Show/Hide Scroll to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Loading Animation for Forms
function showLoading(formElement) {
    const submitBtn = formElement.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    
    // Add spinner styles
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerStyle);
    
    return () => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth reveal animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all service cards, eligibility cards, and sections
    document.querySelectorAll('.service-card, .eligibility-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Console welcome message
console.log('%c🏪 Ration Distribution System', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cEnsuring food security for all citizens', 'font-size: 14px; color: #666;');
