import { useState, useEffect } from "react";

const AdminPanel = ({ token }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [token]);

  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:5000/api/bookings/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    alert(data.message);
    setBookings(bookings.map((b) => (b._id === id ? { ...b, status: "approved" } : b)));
  };

  return (
    <div>
      <h2>Pending Bookings</h2>
      {bookings.map((b) => (
        <div key={b._id}>
          <p>{b.facility.name} - {b.date} - {b.timeSlot}</p>
          <button onClick={() => handleApprove(b._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
