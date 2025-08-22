const admin = require("../config/firebase");
const User = require("../models/User");

const COOKIE_NAME = process.env.COOKIE_NAME || "session";
const isProd = process.env.NODE_ENV === "production";

// Helper to set Firebase session cookie
async function setSessionCookie(res, idToken, rememberMe) {
  const expiresInMs = rememberMe ? 5 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
  const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresInMs });
  res.cookie(COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: expiresInMs,
    path: "/",
  });
}

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const { idToken, name, email, phoneNumber } = req.body;

    if (!idToken || !name || !phoneNumber) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: "This phone number is already registered. Please login." });
    }

    const decoded = await admin.auth().verifyIdToken(idToken, true);
    const uid = decoded.uid;

    const newUser = {
      firebaseUID: uid,
      phoneNumber,
      name: name.trim(),
      role: "member",
    };

    if (email) {
      newUser.email = email;
    } else {
      newUser.email = `${uid}@placeholder.email`;
    }

    const user = await User.create(newUser);
    
    // ✅ REMOVED: The line that automatically logs the user in.
    // await setSessionCookie(res, idToken, true);

    // Now, it just confirms registration without creating a session.
    return res.status(201).json({ message: "Registered successfully", user });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { idToken, rememberMe } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken, true);
    
    // ✅ FIXED: Find user by their unique Firebase ID
    const user = await User.findOne({ firebaseUID: decoded.uid });
    if (!user) {
      return res.status(401).json({ message: "User not registered. Please register first." });
    }

    await setSessionCookie(res, idToken, !!rememberMe);
    return res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// --- LOGOUT ---
exports.logout = async (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME);
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- GET CURRENT USER PROFILE ---
exports.getProfile = async (req, res) => {
  // This function relies on the `auth` middleware to attach `req.user`
  if (req.user) {
    return res.status(200).json({ user: req.user });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
};