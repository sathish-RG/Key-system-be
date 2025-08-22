const express = require('express');
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getMemberCourses 
} = require('../controllers/courseController');

const auth = require('../middlewares/auth');
const allowRoles = require('../middlewares/allowRoles');

// ✅ RULE: Specific routes (like '/my-courses') MUST come before dynamic routes (like '/:id').

// --- PROTECTED ROUTES ---
// Route for logged-in members to get their specific courses
router.get('/my-courses', auth, allowRoles(['member', 'admin']), getMemberCourses);
router.post('/', auth, allowRoles(['admin']), createCourse);
router.put('/:id', auth, allowRoles(['admin']), updateCourse);
router.delete('/:id', auth, allowRoles(['admin']), deleteCourse);

// --- PUBLIC ROUTES ---
// The general "get all" route
router.get('/', getAllCourses);
// The dynamic "get by id" route MUST be last among the GET routes
router.get('/:id', getCourseById);


module.exports = router;