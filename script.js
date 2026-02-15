console.log("SUPABASE SCRIPT LOADED ✅");

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8"; // paste your anon key

let supabase = null;

if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("Supabase client ready 🚀");
} else {
  console.warn("⚠️ Supabase library not loaded - using local mode");
}

/* ================= GLOBAL ================= */

let currentUser = null;

/* ================= AUTH ================= */

// LOGIN
async function loginUser(email, password) {
  if (!supabase) {
    // Local mode
    currentUser = { email: email };
    alert("✅ Login successful!");
    closeLoginModal();
    updateNavbarUser();
    return;
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  currentUser = data.user;
  alert("Login successful 🎉");
  closeLoginModal();
  updateNavbarUser();
}

// SIGNUP
async function signupUser(email, password) {
  if (!supabase) {
    alert("✅ Account created! You can now login.");
    return;
  }
  
  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) alert(error.message);
  else alert("Signup successful — check your email 📩");
}

// LOGIN FORM
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  loginUser(email, password);
});

// RESTORE SESSION ON LOAD
async function restoreSession() {
  if (!supabase) return;
  
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    currentUser = data.session.user;
    updateNavbarUser();
  }
}
restoreSession();

/* ================= NAVBAR USER ================= */

function updateNavbarUser() {
  const btn = document.querySelector(".login-btn");

  if (currentUser) {
    btn.textContent = `Hi, ${currentUser.email.split("@")[0]}`;
    btn.onclick = logoutUser;
  } else {
    btn.textContent = "Login";
    btn.onclick = openLoginModal;
  }
}

async function logoutUser() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  currentUser = null;
  updateNavbarUser();
  alert("Logged out");
}

/* ================= MODALS ================= */

function openLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "block";
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

function openBookingModal(destination = "") {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.style.display = "block";
  const destInput = document.getElementById("bookingDestination");
  if (destInput) destInput.value = destination;
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.style.display = "none";
}

/* ================= BOOKING ================= */

document.getElementById("bookingForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const payload = {
    destination: document.getElementById("bookingDestination").value,
    full_name: document.getElementById("bookingName").value,
    email: document.getElementById("bookingEmail").value,
    phone: document.getElementById("bookingPhone").value,
    travel_date: document.getElementById("bookingDate").value,
    guests: document.getElementById("bookingGuests").value,
    special_requirements: document.getElementById("bookingMessage").value
  };

  console.log("Booking payload:", payload);

  const { error } = await supabase
    .from("bookings")
    .insert([payload]);

  if (error) {
    console.error(error);
    alert("❌ Booking failed");
  } else {
    alert("✅ Booking saved!");
    closeBookingModal();
  }
});

/* ================= CONTACT ================= */

document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("contactName").value,
    email: document.getElementById("contactEmail").value,
    message: document.getElementById("contactMessage").value
  };

  console.log("Contact payload:", payload);

  const { error } = await supabase
    .from("contact_messages")
    .insert([payload]);

  if (error) {
    console.error(error);
    alert("❌ Failed to send message");
  } else {
    alert("✅ Message sent!");
    document.getElementById("contactForm").reset();
  }
});

/* ================= NAV TOGGLE ================= */

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
}

/* ================= CLOSE MODAL CLICK ================= */

window.addEventListener("click", (e) => {
  if (e.target === loginModal) closeLoginModal();
  if (e.target === bookingModal) closeBookingModal();
});