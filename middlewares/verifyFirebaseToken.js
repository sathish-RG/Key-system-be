const admin = require("firebase-admin");

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../config/your-firebase-adminsdk.json"))
  });
}

async function verifyFirebaseToken(req, res, next) {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "idToken is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // { uid, phone_number, ... }
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid ID token" });
  }
}

module.exports = verifyFirebaseToken;
