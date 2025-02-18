import { useState } from "react";

const BookingForm = ({ token }) => {
  const [facilityId, setFacilityId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const handleSubmit = async (e) => {
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Facility ID" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" placeholder="Time Slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required />
      <button type="submit">Book Facility</button>
    </form>
  );
};

export default BookingForm;
