console.log("SUPABASE SCRIPT LOADED ✅");

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8"; // keep your key here

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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

  if (error) return alert(error.message);

  currentUser = data.user;
  alert("Login successful 🎉");
  closeLoginModal();
}

async function signupUser(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Signup successful — check your email 📩");
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  loginUser(loginEmail.value, loginPassword.value);
});

/* ================= MODALS ================= */

function openLoginModal() {
  loginModal.style.display = "block";
}

function closeLoginModal() {
  loginModal.style.display = "none";
}

function openBookingModal(destination = "") {
  bookingModal.style.display = "block";
  document.getElementById("destination").value = destination;
}

function closeBookingModal() {
  bookingModal.style.display = "none";
}

/* ================= BOOKING ================= */

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    destination: destination.value,
    full_name: fullName.value,
    email: bookingEmail.value,
    phone: phone.value,
    travel_date: travelDate.value,
    guests: guests.value,
    special_requirements: specialRequirements.value
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

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: name.value,
    email: email.value,
    message: message.value
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
    contactForm.reset();
  } else {
    console.error(await res.text());
    alert("❌ Failed to send message");
  }
});