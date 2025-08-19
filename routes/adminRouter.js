const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const allowRoles = require('../middlewares/allowRoles');

// Import all necessary controller functions
const { 
  getAllMembers, 
  getAllAdmins, 
  updateUserRole 
} = require('../controllers/adminController');

// Existing route for members
router.get('/members', auth, allowRoles(['admin']), getAllMembers);

// ✅ ADD THIS route to get all admins
router.get('/admins', auth, allowRoles(['admin']), getAllAdmins);

// ✅ ADD THIS route to update a user's role
router.put('/users/:userId/role', auth, allowRoles(['admin']), updateUserRole);

module.exports = router;