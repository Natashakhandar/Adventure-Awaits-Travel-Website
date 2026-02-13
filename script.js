/*
 * ADVENTURE AWAITS TRAVEL WEBSITE
 * Updated Version - Connected to MySQL Backend
 */

// ===========================================
// GLOBAL VARIABLES
// ===========================================
let currentUser = null;
let isLoggedIn = false;

const loginModal = document.getElementById('loginModal');
const bookingModal = document.getElementById('bookingModal');

// ===========================================
// NAVIGATION
// ===========================================

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function () {

    // Smooth scroll
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            document.querySelector('.nav-menu').classList.remove('active');
        });
    });

    // ===========================================
    // LOGIN FORM
    // ===========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (email && password) {
                currentUser = { email, name: email.split('@')[0] };
                isLoggedIn = true;
                updateLoginStatus();
                showNotification('Login successful! Welcome back ' + currentUser.name, 'success');
                closeLoginModal();
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
    }

    // ===========================================
    // BOOKING FORM (CONNECTED TO BACKEND)
    // ===========================================
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const bookingData = {
                destination: document.getElementById('bookingDestination').value,
                fullName: document.getElementById('bookingName').value,
                email: document.getElementById('bookingEmail').value,
                phone: document.getElementById('bookingPhone').value,
                travelDate: document.getElementById('bookingDate').value,
                guests: document.getElementById('bookingGuests').value,
                specialRequirements: document.getElementById('bookingMessage').value
            };

            if (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.travelDate || !bookingData.guests) {
                showNotification('Please fill all required fields', 'error');
                return;
            }

            if (!isValidEmail(bookingData.email)) {
                showNotification('Invalid email address', 'error');
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/book", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();

                if (response.ok) {
                    showNotification(result.message, 'success');
                    bookingForm.reset();
                    closeBookingModal();
                } else {
                    showNotification('Booking failed', 'error');
                }

            } catch (err) {
                showNotification('Backend not running or server error', 'error');
            }
        });
    }

    // ===========================================
    // CONTACT FORM (CONNECTED TO BACKEND)
    // ===========================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Invalid email address', 'error');
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (response.ok) {
                    showNotification(result.message, 'success');
                    contactForm.reset();
                } else {
                    showNotification('Message failed', 'error');
                }

            } catch (err) {
                showNotification('Backend not running or server error', 'error');
            }
        });
    }
});

// ===========================================
// LOGIN HELPERS
// ===========================================

function openLoginModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('loginForm').reset();
}

function updateLoginStatus() {
    const loginBtn = document.querySelector('.login-btn');
    if (isLoggedIn && currentUser) {
        loginBtn.textContent = `Hi, ${currentUser.name}`;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openLoginModal;
    }
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    updateLoginStatus();
    showNotification('Logged out successfully', 'info');
}

// ===========================================
// BOOKING MODAL HELPERS
// ===========================================

function openBookingModal(destination = '') {
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    document.getElementById('bookingDestination').value = destination;

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
}

function closeBookingModal() {
    bookingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===========================================
// UTILITIES
// ===========================================

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.color = 'white';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '9999';
    notification.style.background =
        type === 'success' ? '#28a745' :
        type === 'error' ? '#dc3545' :
        '#17a2b8';

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 4000);
}

console.log("Adventure Awaits Website Connected to Backend 🚀");
