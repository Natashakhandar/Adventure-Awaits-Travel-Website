console.log("✅ SCRIPT LOADED");

const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8";

/* ================= CONTACT FORM ================= */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#contactForm #name").value;
    const email = document.querySelector("#contactForm #email").value;
    const message = document.querySelector("#contactForm #message").value;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ name, email, message })
    });

    console.log("CONTACT STATUS:", res.status);

    if (res.ok) {
      alert("✅ Message stored in database");
      contactForm.reset();
    } else {
      alert("❌ Error sending message");
    }
  });
}

/* ================= BOOKING FORM ================= */
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
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
      body: JSON.stringify(data)
    });

    console.log("BOOKING STATUS:", res.status);

    if (res.ok) {
      alert("✅ Booking saved in database");
      bookingForm.reset();
    } else {
      alert("❌ Booking failed");
    }
  });
}