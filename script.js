/*
 * ADVENTURE AWAITS TRAVEL WEBSITE
 * Supabase Integrated Version
 */

console.log("SUPABASE SCRIPT LOADED ✅");

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8";

/* ================= GLOBAL VARIABLES ================= */

let currentUser = null;
let isLoggedIn = false;

const loginModal = document.getElementById("loginModal");
const bookingModal = document.getElementById("bookingModal");

/* ================= NAVIGATION ================= */

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
}

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.style.background =
    window.scrollY > 50
      ? "rgba(255,255,255,0.98)"
      : "rgba(255,255,255,0.95)";
});

/* ================= LOGIN ================= */

function openLoginModal() {
  loginModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeLoginModal() {
  loginModal.style.display = "none";
  document.body.style.overflow = "auto";
  document.getElementById("loginForm").reset();
}

function updateLoginStatus() {
  const btn = document.querySelector(".login-btn");
  if (isLoggedIn) {
    btn.textContent = `Hi, ${currentUser.name}`;
    btn.onclick = logout;
  } else {
    btn.textContent = "Login";
    btn.onclick = openLoginModal;
  }
}

function logout() {
  currentUser = null;
  isLoggedIn = false;
  updateLoginStatus();
  showNotification("Logged out", "info");
}

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  if (email && password) {
    currentUser = { name: email.split("@")[0], email };
    isLoggedIn = true;
    updateLoginStatus();
    closeLoginModal();
    showNotification("Login successful", "success");
  }
});

/* ================= BOOKING MODAL ================= */

function openBookingModal(destination = "") {
  bookingModal.style.display = "block";
  document.body.style.overflow = "hidden";
  document.getElementById("destination").value = destination;
}

function closeBookingModal() {
  bookingModal.style.display = "none";
  document.body.style.overflow = "auto";
  document.getElementById("bookingForm").reset();
}

/* ================= BOOKING SUBMIT ================= */

document.getElementById("bookingForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    destination: destination.value,
    full_name: fullName.value,
    email: bookingEmail.value,
    phone: phone.value,
    travel_date: travelDate.value,
    guests: guests.value,
    special_requirements: specialRequirements.value
  };

  console.log("Sending booking:", data);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    showNotification("✅ Booking saved!", "success");
    closeBookingModal();
  } else {
    console.error(await res.text());
    showNotification("❌ Booking failed", "error");
  }
});

/* ================= CONTACT SUBMIT ================= */

document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  console.log("Sending contact:", payload);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    showNotification("✅ Message sent!", "success");
    document.getElementById("contactForm").reset();
  } else {
    console.error(await res.text());
    showNotification("❌ Failed to send message", "error");
  }
});

/* ================= NOTIFICATIONS ================= */

function showNotification(msg, type = "info") {
  const colors = {
    success: "#28a745",
    error: "#dc3545",
    info: "#17a2b8"
  };

  const n = document.createElement("div");
  n.innerText = msg;
  n.style.cssText = `
    position:fixed;
    top:100px;
    right:20px;
    background:${colors[type]};
    color:white;
    padding:12px 18px;
    border-radius:6px;
    z-index:9999;
  `;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

/* ================= CLOSE MODAL ================= */

window.addEventListener("click", (e) => {
  if (e.target === loginModal) closeLoginModal();
  if (e.target === bookingModal) closeBookingModal();
});