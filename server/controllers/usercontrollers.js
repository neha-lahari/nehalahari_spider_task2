const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ---------------- REGISTER ----------------
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPw = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPw });
        await user.save();

        res.status(201).json({
            message: "User registered",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ---------------- LOGIN ----------------
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_secret,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------------- GET PROFILE ----------------
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "username email profilePic"
        );

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- UPDATE PROFILE ----------------
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email },
            { new: true }
        ).select("username email profilePic");

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- FORGOT PASSWORD ----------------
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate raw token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before saving
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email config
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"BillSplit" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset your BillSplit password",
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link is valid for 15 minutes.</p>
            `
        });

        res.json({ message: "Password reset link sent to email" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPw = await bcrypt.hash(newPassword, 10);

        user.password = hashedPw;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
