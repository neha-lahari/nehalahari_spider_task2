const express = require('express');
const router = express.Router();
const path = require("path");
const authenticate = require('../middleware/jwtmiddleware');
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/usercontrollers');
const User = require('../models/user');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
// router.post('/profile-pic', authenticate, upload.single("profilePic"), uploadProfilePic);//########

router.get('/my-friends', authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('friends', 'username email');
  res.json({ friends: user.friends });
});

module.exports = router;
