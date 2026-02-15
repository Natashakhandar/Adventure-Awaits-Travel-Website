console.log("SUPABASE SCRIPT LOADED ✅");

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8"; // your anon key

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ================= GLOBAL ================= */

let currentUser = null;

const loginModal = document.getElementById("loginModal");
const bookingModal = document.getElementById("bookingModal");
const loginBtn = document.querySelector(".login-btn");

/* ================= SESSION CHECK ================= */

(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    currentUser = data.session.user;
    updateLoginUI();
  }
})();

/* ================= LOGIN ================= */

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  currentUser = data.user;
  updateLoginUI();
  alert("Login successful 🎉");
  closeLoginModal();
}

async function signupUser(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) alert(error.message);
  else alert("Signup successful — check your email 📩");
}

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  loginUser(email, password);
});

/* ================= LOGOUT ================= */

async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  updateLoginUI();
}

function updateLoginUI() {
  if (!loginBtn) return;

  if (currentUser) {
    loginBtn.textContent = `Hi, ${currentUser.email.split("@")[0]}`;
    loginBtn.onclick = logout;
  } else {
    loginBtn.textContent = "Login";
    loginBtn.onclick = openLoginModal;
  }
}

/* ================= MODALS ================= */

function openLoginModal() {
  loginModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeLoginModal() {
  loginModal.style.display = "none";
  document.body.style.overflow = "auto";
}

function openBookingModal(destination = "") {
  bookingModal.style.display = "block";
  document.body.style.overflow = "hidden";
  document.getElementById("destination").value = destination;
}

function closeBookingModal() {
  bookingModal.style.display = "none";
  document.body.style.overflow = "auto";
}

/* ================= BOOKING ================= */

document.getElementById("bookingForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const payload = {
    destination: document.getElementById("destination").value,
    full_name: document.getElementById("fullName").value,
    email: document.getElementById("bookingEmail").value,
    phone: document.getElementById("phone").value,
    travel_date: document.getElementById("travelDate").value,
    guests: document.getElementById("guests").value,
    special_requirements: document.getElementById("specialRequirements").value
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
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
    alert("✅ Booking saved!");
    closeBookingModal();
  } else {
    console.error(await res.text());
    alert("❌ Booking failed");
  }
});

/* ================= CONTACT ================= */

document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

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
    alert("✅ Message sent!");
    document.getElementById("contactForm").reset();
  } else {
    console.error(await res.text());
    alert("❌ Failed to send message");
  }
});

/* ================= CLOSE MODAL CLICK ================= */

window.addEventListener("click", (e) => {
  if (e.target === loginModal) closeLoginModal();
  if (e.target === bookingModal) closeBookingModal();
});