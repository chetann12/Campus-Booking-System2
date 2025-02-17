const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log("Decoded Token:", decoded); // Check if user is extracted

    // req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
    req.user = await User.findById(decoded.userId).select('-password'); // Use decoded.userId
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log("Authenticated User:", req.user); // Log the user
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
