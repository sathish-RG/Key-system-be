// controllers/authController.js
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

/**
 * POST /api/auth/register
 * Body: { idToken, fullName, email, phoneNumber, rememberMe }
 */
// ... (imports)

// ... (setSessionCookie function)

// In controllers/authController.js

exports.register = async (req, res) => {
  try {
    const { idToken, name, email, phoneNumber, rememberMe } = req.body;

    if (!idToken) return res.status(400).json({ message: "idToken is required" });
    if (!phoneNumber) return res.status(400).json({ message: "phoneNumber is required" });
    if (!name) return res.status(400).json({ message: "name is required" });

    // Verify OTP token with Firebase
    const decoded = await admin.auth().verifyIdToken(idToken, true);
    const uid = decoded.uid;

    // Check if already registered
    let user = await User.findOne({ firebaseUID: uid });
    if (user) {
      return res.status(409).json({ message: "User already registered, please login" });
    }

    // --- ✅ CORRECTED LOGIC ---
    // 1. Build the new user object
    const newUser = {
      firebaseUID: uid,
      phoneNumber,
      name: name.trim(),
      role: "member",
    };

    // 2. Conditionally add the email to ensure it's always unique and valid
    if (email) {
      // If the user provided an email in the form
      newUser.email = email;
    } else if (decoded.email) {
      // Fallback to the email from the decoded token (if it exists)
      newUser.email = decoded.email;
    } else {
      // If no email is available, create a unique placeholder to satisfy
      // the 'required' and 'unique' constraints in your schema.
      newUser.email = `${uid}@placeholder.email`;
    }

    // 3. Create the user with the guaranteed-valid object
    user = await User.create(newUser);
    // --- END OF CORRECTION ---

    // Set cookie
    await setSessionCookie(res, idToken, !!rememberMe);

    return res.status(201).json({ message: "Registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);
    // This will now log a more specific database error if one occurs
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { idToken, phoneNumber, rememberMe } = req.body;
    if (!idToken) return res.status(400).json({ message: "idToken is required" });
    if (!phoneNumber) return res.status(400).json({ message: "phoneNumber is required" });

    // Verify OTP with Firebase
    const decoded = await admin.auth().verifyIdToken(idToken, true);
    const uid = decoded.uid;

    // Check if registered in MongoDB
    let user = await User.findOne({ firebaseUID: uid, phoneNumber });
    if (!user) {
      return res.status(401).json({ message: "User not registered, please register first" });
    }

    // Set cookie
    await setSessionCookie(res, idToken, !!rememberMe);

    return res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
    });
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/auth/me
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.firebase) return res.status(401).json({ message: "Unauthorized" });

    let user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    return res.json({
      user,
      firebase: {
        uid: req.firebase.uid,
        email: req.firebase.email,
        phoneNumber: req.firebase.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
