const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const allowRoles = require('../middlewares/allowRoles');

const { 
  getAllMembers, 
  getAllAdmins, 
  updateUserRole,
  updateCourseAccess // Import the new function
} = require('../controllers/adminController');

router.get('/members', auth, allowRoles(['admin']), getAllMembers);
router.get('/admins', auth, allowRoles(['admin']), getAllAdmins);
router.put('/users/:userId/role', auth, allowRoles(['admin']), updateUserRole);

// ✅ ADD THIS ROUTE to update a user's course access
router.put('/users/:userId/access', auth, allowRoles(['admin']), updateCourseAccess);

module.exports = router;