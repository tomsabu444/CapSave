// middlewares/authMiddleware.js
const admin = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyFirebaseToken;
