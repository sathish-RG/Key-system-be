const express = require('express');
const courseRouter = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const auth = require('../middlewares/auth');
const allowRoles = require('../middlewares/allowRoles');

// Public routes
courseRouter.route('/').get(getAllCourses);
courseRouter.route('/:id').get(getCourseById);

// Admin-only routes
courseRouter.route('/').post(auth, allowRoles(['admin']), createCourse);
courseRouter.route('/:id').put(auth, allowRoles(['admin']), updateCourse);
courseRouter.route('/:id').delete(auth, allowRoles(['admin']), deleteCourse);

module.exports = courseRouter;