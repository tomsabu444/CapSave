const admin = require("firebase-admin");

// ✅ Decode Firebase Admin SDK credentials from environment variable
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_SDK_BASE64, "base64").toString("utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
