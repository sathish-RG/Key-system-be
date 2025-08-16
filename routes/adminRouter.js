// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/allowRoles");

router.get(
  "/dashboard",
  auth,
  allowRoles(["admin"]), // Only admins can access
  (req, res) => {
    res.json({ message: `Welcome admin ${req.user.name}` });
  }
);

module.exports = router;
