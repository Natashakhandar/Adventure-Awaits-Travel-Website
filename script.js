console.log("Script loaded");

/* ================= CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "sb_publishable_SFk5HO51xF4bKqx9FZ8qhQ_DVRp5KWe";

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

  const payload = {
    destination: document.getElementById("destination")?.value || "",
    full_name: document.getElementById("fullName")?.value || "",
    email: document.getElementById("bookingEmail")?.value || "",
    phone: document.getElementById("phone")?.value || "",
    travel_date: document.getElementById("travelDate")?.value || "",
    guests: document.getElementById("guests")?.value || "",
    special_requirements:
      document.getElementById("specialRequirements")?.value || ""
  };

  console.log("FINAL PAYLOAD 👉", payload);

  fetch(SUPABASE_URL + "/rest/v1/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Insert failed");
      return fetch("https://uisq4xq155.execute-api.ap-south-1.amazonaws.com/default/sendBookingEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    })
    .then(() => {
      alert("✅ Booking saved & email sent!");
      closeBookingModal();
      document.getElementById("bookingForm").reset();
    })
    .catch(err => {
      console.error("❌ ERROR:", err);
      alert("Booking failed");
    });
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
