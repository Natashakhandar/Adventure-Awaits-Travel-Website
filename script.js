console.log("SUPABASE SCRIPT LOADED ✅");

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8";

console.log("Supabase URL:", SUPABASE_URL);

if (!window.supabase) {
  console.error("❌ Supabase library NOT loaded. Check CDN in HTML.");
}

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Supabase client created:", supabase);

/* ================= GLOBAL ================= */

let currentUser = null;

const loginModal = document.getElementById("loginModal");
const bookingModal = document.getElementById("bookingModal");

/* ================= LOGIN ================= */

async function loginUser(email, password) {
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

/* ================= MODALS ================= */

function openLoginModal() {
  if (loginModal) loginModal.style.display = "block";
}

function closeLoginModal() {
  if (loginModal) loginModal.style.display = "none";
}

function openBookingModal(destination = "") {
  if (bookingModal) bookingModal.style.display = "block";

  const destInput = document.getElementById("destination");
  if (destInput) destInput.value = destination;
}

function closeBookingModal() {
  if (bookingModal) bookingModal.style.display = "none";
}

/* ================= BOOKING ================= */

document.getElementById("bookingForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    destination: document.getElementById("destination").value,
    full_name: document.getElementById("fullName").value,
    email: document.getElementById("bookingEmail").value,
    phone: document.getElementById("phone").value,
    travel_date: document.getElementById("travelDate").value,
    guests: document.getElementById("guests").value,
    special_requirements: document.getElementById("specialRequirements").value
  };

  console.log("Booking payload:", payload);

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
  name: document.getElementById("contactName").value,
  email: document.getElementById("contactEmail").value,
  message: document.getElementById("contactMessage").value
};
  console.log("Contact payload:", payload);

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