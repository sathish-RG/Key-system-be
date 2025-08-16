const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/allowRoles");

router.get("/profile", auth, allowRoles(["member", "admin"]), (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
});

module.exports = router;
