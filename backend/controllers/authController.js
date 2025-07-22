// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });
        res.json({ message: "Registered successfully" });
    } catch (err) {
        res.status(400).json({ error: "Username or email may already exist" });
    }
};

exports.login = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.json({ message: "Logged in successfully", user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.profile = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user: req.session.user });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: "Logged out" });
};
