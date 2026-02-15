console.log("SUPABASE SCRIPT LOADED ✅");

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Supabase Ready 🚀");

/* ================= GLOBAL ================= */

const bookingModal = document.getElementById("bookingModal");
const loginModal = document.getElementById("loginModal");

/* ================= MODALS ================= */

function openLoginModal() {
  if (loginModal) loginModal.style.display = "block";
}

function closeLoginModal() {
  if (loginModal) loginModal.style.display = "none";
}

function openBookingModal(destination = "") {
  if (bookingModal) bookingModal.style.display = "block";

  const dest = document.getElementById("destination");
  if (dest) dest.value = destination;
}

function closeBookingModal() {
  if (bookingModal) bookingModal.style.display = "none";
}

/* ================= BOOKING FORM ================= */

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
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

    console.log("Sending booking:", payload);

    const { error } = await supabase
      .from("bookings")
      .insert([payload]);

    if (error) {
      console.error(error);
      alert("❌ Booking failed");
      return;
    }

    alert("✅ Booking saved!");
    closeBookingModal();
  });
}

/* ================= CONTACT FORM ================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      message: document.getElementById("contactMessage").value
    };

    console.log("Sending contact:", payload);

    const { error } = await supabase
      .from("contact_messages")
      .insert([payload]);

    if (error) {
      console.error(error);
      alert("❌ Failed to send message");
      return;
    }

    alert("✅ Message sent!");
    contactForm.reset();
  });
}

/* ================= CLOSE MODAL OUTSIDE CLICK ================= */

window.addEventListener("click", (e) => {
  if (e.target === bookingModal) closeBookingModal();
  if (e.target === loginModal) closeLoginModal();
});