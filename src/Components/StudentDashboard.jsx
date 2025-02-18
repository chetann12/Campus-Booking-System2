import { useState, useEffect } from "react";

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]); // Holds existing bookings
  const [facilityId, setFacilityId] = useState(""); // Holds input for booking
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const token = localStorage.getItem("token"); // Get token from localStorage

  // Fetch bookings when component loads
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/bookings/my-bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        const approved = data.filter((b) => b.status === "Approved");
        if (approved.length > 0) alert("Your booking has been approved!");
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [token]);

  // Handle Booking Form Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ facilityId, date, timeSlot }),
    });

    const data = await res.json();
    alert(data.message);

    // Refresh bookings after submission
    if (res.ok) {
      setBookings([...bookings, data.booking]);
      setFacilityId("");
      setDate("");
      setTimeSlot("");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📅 My Bookings</h2>

      {/* Booking Form */}
      <div className="booking-form">
        <h3>📌 Request a Booking</h3>
        <form onSubmit={handleBookingSubmit}>
          <input type="text" placeholder="Facility ID" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} required />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="text" placeholder="Time Slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required />
          <button type="submit">Book Facility</button>
        </form>
      </div>

      {/* Booking List */}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.facility?.name || "Unknown"}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
