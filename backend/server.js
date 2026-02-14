const SUPABASE_URL = "https://nwttotkdkxtlovioftyv.supabase.co";

const SUPABASE_KEY = "PASTE_YOUR_LONG_ANON_KEY_HERE";

/* ================= BOOKING ================= */
async function submitBooking(data) {
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

  if (res.ok) alert("✅ Booking saved!");
  else alert("❌ Booking failed");
}

/* ================= CONTACT ================= */
async function submitContact(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      message: data.message
    })
  });

  if (res.ok) alert("✅ Message sent!");
  else alert("❌ Message failed");
}