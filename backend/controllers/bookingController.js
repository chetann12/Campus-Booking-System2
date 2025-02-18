const Booking = require("../models/Booking");
const Facility = require("../models/Facility");

// 🟢 Student Requests a Booking
exports.requestBooking = async (req, res) => {
  const { facilityId, date, timeSlot } = req.body;

  try {
    // Check if facility exists
    const facility = await Facility.findById(facilityId);
    if (!facility) return res.status(404).json({ message: "Facility not found" });

    // Check if the facility is already booked for the requested date & time
    const existingBooking = await Booking.findOne({ facility: facilityId, date, timeSlot });
    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked. Choose another slot." });
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user._id,
      facility: facilityId,
      date,
      timeSlot,
      status: "Pending",
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking request submitted", booking: newBooking });
  } catch (error) {
    console.error("Booking Request Error:", error);
    res.status(500).json({ message: "Failed to process booking", error: error.message });
  }
};

// 🟢 Admin Approves or Rejects a Booking
exports.updateBookingStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Use 'Approved' or 'Rejected'." });
  }

  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update booking status
    booking.status = status;
    await booking.save();

    // If approved, update facility availability
    if (status === "Approved") {
      await Facility.findByIdAndUpdate(booking.facility, { availability: false });
    } else {
      await Facility.findByIdAndUpdate(booking.facility, { availability: true });
    }

    res.json({ message: `Booking ${status.toLowerCase()}`, booking });
  } catch (error) {
    console.error("Booking Status Update Error:", error);
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};

// 🟢 Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("facility", "name location availability");

    res.json(bookings);
  } catch (error) {
    console.error("Error Fetching All Bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// 🟢 Get User's Bookings (Student or Faculty)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("facility", "name location");

    res.json(bookings);
  } catch (error) {
    console.error("Error Fetching User Bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
};
