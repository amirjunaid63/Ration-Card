# Hind Car Wash Website

A modern, responsive car wash website built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works perfectly on all devices (desktop, tablet, mobile)
- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: 
  - Smooth scrolling navigation
  - Mobile hamburger menu
  - Form validation
  - Dynamic notifications
  - Service and pricing interactions
- **Booking System**: Online appointment booking with form validation
- **Contact Section**: Contact form with Google Maps integration
- **Pricing Plans**: Clear pricing structure with INR currency

## File Structure

```
Hind-Car-Wash/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

### Updating Location
To update the Google Maps location:
1. Go to Google Maps
2. Search for your business location
3. Click "Share" → "Embed a map"
4. Copy the iframe src URL
5. Replace the current src in index.html (line 344)

### Updating Contact Information
Update the following in index.html:
- Phone number (line 318)
- Email address (line 323)
- Address (line 313)
- Working hours (line 328-330)

### Updating Prices
Prices are set in INR and can be updated in:
- index.html pricing cards (lines 154, 172, 189)
- index.html booking form dropdown (lines 231-233)
- script.js confirmation messages (lines 123-125)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Getting Started

1. Open `index.html` in your web browser
2. The website will load with all functionality working
3. No server required - runs locally

## Features Details

### Navigation
- Fixed header with smooth scroll
- Mobile-responsive hamburger menu
- Active state indicators

### Services Section
- Three service tiers with hover effects
- Click to scroll to pricing
- Feature lists for each service

### Pricing Section
- Three pricing plans with INR currency
- Featured plan highlighting
- Interactive selection with booking integration

### Booking System
- Complete form validation
- Date/time selection
- Service pre-selection from pricing
- Success notifications

### Contact Section
- Contact information display
- Working contact form
- Embedded Google Maps
- Responsive layout

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript ES6+**: Interactive functionality
- **Font Awesome**: Icons
- **Google Fonts**: Poppins typography
- **Google Maps**: Location integration

## License

This project is open source and available under the [MIT License](LICENSE).
