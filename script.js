console.log("Script loaded");

/* ================= CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8";

/* ================= HAMBURGER MENU ================= */

function toggleMenu() {
  var navMenu = document.querySelector(".nav-menu");
  var hamburger = document.querySelector(".hamburger");
  if (navMenu) navMenu.classList.toggle("active");
  if (hamburger) hamburger.classList.toggle("active");
}

/* ================= MODALS ================= */

function openLoginModal() {
  var modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "block";
}

function closeLoginModal() {
  var modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

function openBookingModal(destination) {
  var modal = document.getElementById("bookingModal");
  if (modal) modal.style.display = "block";
  
  var destInput = document.getElementById("bookingDestination");
  if (destInput && destination) destInput.value = destination;
}

function closeBookingModal() {
  var modal = document.getElementById("bookingModal");
  if (modal) modal.style.display = "none";
}

/* ================= LOGIN ================= */

function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  
  if (email && password) {
    alert("Login successful!");
    closeLoginModal();
  }
}

var loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

/* ================= BOOKING ================= */

function handleBooking(e) {
  e.preventDefault();
  
  var payload = {
    destination: document.getElementById("bookingDestination") ? document.getElementById("bookingDestination").value : "",
    full_name: document.getElementById("bookingName") ? document.getElementById("bookingName").value : "",
    email: document.getElementById("bookingEmail") ? document.getElementById("bookingEmail").value : "",
    phone: document.getElementById("bookingPhone") ? document.getElementById("bookingPhone").value : "",
    travel_date: document.getElementById("bookingDate") ? document.getElementById("bookingDate").value : "",
    guests: document.getElementById("bookingGuests") ? document.getElementById("bookingGuests").value : "",
    special_requirements: document.getElementById("bookingMessage") ? document.getElementById("bookingMessage").value : ""
  };

  console.log("Booking:", payload);

  fetch(SUPABASE_URL + "/rest/v1/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if (res.ok) {
      alert("Booking saved!");
      closeBookingModal();
      document.getElementById("bookingForm").reset();
    } else {
      alert("Booking failed");
    }
  })
  .catch(function(err) {
    console.error(err);
    alert("Booking failed");
  });
}

var bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", handleBooking);
}

/* ================= CONTACT ================= */

function handleContact(e) {
  e.preventDefault();
  
  var payload = {
    name: document.getElementById("contactName") ? document.getElementById("contactName").value : "",
    email: document.getElementById("contactEmail") ? document.getElementById("contactEmail").value : "",
    message: document.getElementById("contactMessage") ? document.getElementById("contactMessage").value : ""
  };

  console.log("Contact:", payload);

  fetch(SUPABASE_URL + "/rest/v1/contact_messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if (res.ok) {
      alert("Message sent!");
      document.getElementById("contactForm").reset();
    } else {
      alert("Failed to send message");
    }
  })
  .catch(function(err) {
    console.error(err);
    alert("Failed to send message");
  });
}

var contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", handleContact);
}

/* ================= CLOSE MODAL ON OUTSIDE CLICK ================= */

window.onclick = function(e) {
  var loginModal = document.getElementById("loginModal");
  var bookingModal = document.getElementById("bookingModal");
  
  if (e.target === loginModal) closeLoginModal();
  if (e.target === bookingModal) closeBookingModal();
};

console.log("All ready!");
