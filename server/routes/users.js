const express = require('express');
const router = express.Router(); // mini app
const path = require("path");
const authenticate = require('../middleware/jwtmiddleware');
const upload = require('../middleware/upload');

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/usercontrollers');

const User = require('../models/user');
-
  router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.post(// upload profile pic
  '/upload-profile-pic',
  authenticate,
  upload.single('profilePic'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const user = await User.findById(req.user.userId);

      user.profilePic = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({
        message: 'Profile picture updated successfully',
        profilePic: user.profilePic
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Profile picture upload failed' });
    }
  }
);


router.get('/my-friends', authenticate, async (req, res) => {// get frns details
  try {
    const user = await User.findById(req.user.userId)
      .populate('friends', 'username email profilePic');

    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
});

// Get user's friends
router.get("/friends", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("friends", "username _id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: "Error fetching friends", error: err.message });
  }
});
module.exports = router;

