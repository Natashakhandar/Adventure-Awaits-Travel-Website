console.log("SCRIPT RUNNING");
const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHRvdGtka3h0bG92aW9mdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjM5ODMsImV4cCI6MjA4NjYzOTk4M30.RuZNwe_7W2uuBNH5oX5Hr3RzvP5RlQ99hjUUw7dk5x8";

/* ================= CONTACT FORM ================= */

document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ name, email, message })
  });

  if (res.ok) {
    alert("✅ Message sent!");
  } else {
    alert("❌ Error sending message");
  }
});


/* ================= BOOKING FORM ================= */

document.getElementById("bookingForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    destination: document.getElementById("destination").value,
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    travelDate: document.getElementById("travelDate").value,
    guests: document.getElementById("guests").value,
    specialRequirements: document.getElementById("specialRequirements").value
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      destination: data.destination,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      travel_date: data.travelDate,
      guests: data.guests,
      special_requirements: data.specialRequirements
    })
  });

  if (res.ok) {
    alert("✅ Booking saved!");
  } else {
    alert("❌ Error saving booking");
  }
});