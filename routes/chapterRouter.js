const express = require('express');
// ✅ Use the conventional variable name 'router'
const router = express.Router({ mergeParams: true });

// Import Controller
const {
  addChapterToCourse,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter
} = require('../controllers/chapterController');

// Import Middleware
const auth = require('../middlewares/auth');
const allowRoles = require('../middlewares/allowRoles');


// Routes for /api/courses/:courseId/chapters
// ✅ Use 'router' here
router
  .route('/')
  .get(getAllChapters)
  .post(
    auth,
    allowRoles(['admin']),
    addChapterToCourse
  );

// Routes for /api/courses/:courseId/chapters/:chapterId
// ✅ Use 'router' here as well
router
  .route('/:chapterId')
  .get(getChapterById)
  .put(
    auth,
    allowRoles(['admin']),
    updateChapter
  )
  .delete(
    auth,
    allowRoles(['admin']),
    deleteChapter
  );

// ✅ Export the 'router' instance
module.exports = router;