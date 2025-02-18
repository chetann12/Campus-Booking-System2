// const express = require('express');
// const Booking = require('../models/Booking');
// const Facility = require('../models/Facility');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// // Student Requests a Booking
// router.post('/', authMiddleware, async (req, res) => {
//   const { facilityId, date, timeSlot } = req.body;

//   try {
//     const facility = await Facility.findById(facilityId);
//     if (!facility) return res.status(404).json({ message: 'Facility not found' });

//     const newBooking = new Booking({
//       user: req.user._id, // From auth middleware
//       facility: facilityId,
//       date,
//       timeSlot,
//       status: 'Pending' // Default status
//     });

//     await newBooking.save();
//     res.status(201).json({ message: 'Booking request submitted', booking: newBooking });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// // Admin Approves or Rejects a Booking
// router.put('/:bookingId/status', authMiddleware, async (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admins only.' });
//   }

//   const { status } = req.body;
//   if (!['Approved', 'Rejected'].includes(status)) {
//     return res.status(400).json({ message: 'Invalid status' });
//   }

//   try {
//     const booking = await Booking.findById(req.params.bookingId);
//     if (!booking) return res.status(404).json({ message: 'Booking not found' });

//     booking.status = status;
//     await booking.save();

//     res.json({ message: `Booking ${status.toLowerCase()}`, booking });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// // Get All Bookings (Admin)
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const bookings = await Booking.find().populate('user', 'name email').populate('facility', 'name');
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// // Get User's Bookings (Student or Faculty)
// router.get('/my-bookings', authMiddleware, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user.id }).populate('facility', 'name');
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// module.exports = router;


const express = require("express");
const { requestBooking, updateBookingStatus, getAllBookings, getUserBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, requestBooking);
router.put("/:bookingId/status", authMiddleware, updateBookingStatus);
router.get("/", authMiddleware, getAllBookings);
router.get("/my-bookings", authMiddleware, getUserBookings);

module.exports = router;

