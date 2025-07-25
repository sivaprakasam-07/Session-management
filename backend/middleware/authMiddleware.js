// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
};
