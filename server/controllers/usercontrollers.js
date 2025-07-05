const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//register 
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPw = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPw });
        await user.save();
        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_secret,
            { expiresIn: "1d" }
        );
        res.json({
            message: "login successful",
            token,
            user: { _id: user._id, username: user.username }
        });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
//Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("username email profilePic");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email },
            { new: true }
        )
        res.json({
            username: updated.username,
            email: updated.email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
