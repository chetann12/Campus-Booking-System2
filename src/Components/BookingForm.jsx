import { useState, useEffect } from "react";

const BookingForm = ({ token, facilities }) => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [facilityId, setFacilityId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  useEffect(() => {
    if (selectedFacility) {
      // Fetch available slots for the selected facility for the next week
      const nextWeek = getNextWeek();
      const slots = nextWeek.map((day) => ({
        date: day,
        slots: ["9 AM - 12 PM", "2 PM - 4 PM"]
      }));
      setAvailableSlots(slots);
    }
  }, [selectedFacility]);

  const getNextWeek = () => {
    const currentDate = new Date();
    const nextWeek = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + i);
      nextWeek.push(nextDay.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
    }
    return nextWeek;
  };

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
    <div>
      <h2>Select Facility</h2>
      <div>
        {facilities.map((facility) => (
          <button
            key={facility._id}
            onClick={() => setSelectedFacility(facility)}
          >
            {facility.name}
          </button>
        ))}
      </div>

      {selectedFacility && (
        <div>
          <h3>Available Slots for {selectedFacility.name}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Facility ID"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              <option value="">Select Time Slot</option>
              {availableSlots
                .filter((slot) => slot.date === date)
                .map((slot) =>
                  slot.slots.map((slotTime, index) => (
                    <option key={index} value={slotTime}>
                      {slotTime}
                    </option>
                  ))
                )}
            </select>
            <button type="submit">Book Facility</button>
          </form>

          <h4>Availability for Next Week</h4>
          <ul>
            {availableSlots.map((slot) => (
              <li key={slot.date}>
                {slot.date}: {slot.slots.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
