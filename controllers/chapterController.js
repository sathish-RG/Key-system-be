const Course = require('../models/Course');

/**
 * @desc    Add a new chapter to a course
 * @route   POST /api/courses/:courseId/chapters
 * @access  Admin
 */
// In controllers/chapterController.js
exports.addChapterToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.chapters.push(req.body);
    await course.save();
    res.status(201).json(course.chapters[course.chapters.length - 1]);
  } catch (err) {
    console.error('Error adding chapter:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
/**
 * @desc    Get all chapters for a specific course
 * @route   GET /api/courses/:courseId/chapters
 * @access  Public
 */
exports.getAllChapters = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course.chapters);
  } catch (err) {
    console.error('Error getting all chapters:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single chapter by its ID
 * @route   GET /api/courses/:courseId/chapters/:chapterId
 * @access  Public
 */
exports.getChapterById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const chapter = course.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.status(200).json(chapter);
  } catch (err) {
    console.error('Error getting chapter by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a chapter
 * @route   PUT /api/courses/:courseId/chapters/:chapterId
 * @access  Admin
 */
exports.updateChapter = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const chapter = course.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Update the chapter fields with data from req.body
    Object.assign(chapter, req.body);
    await course.save();
    
    res.status(200).json(chapter);
  } catch (err) {
    console.error('Error updating chapter:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a chapter from a course
 * @route   DELETE /api/courses/:courseId/chapters/:chapterId
 * @access  Admin
 */
exports.deleteChapter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;

    // REFINED: Use updateOne with $pull for a single, efficient database operation.
    // This finds the course and removes the chapter from its array in one step.
    const result = await Course.updateOne(
      { _id: courseId },
      { $pull: { chapters: { _id: chapterId } } }
    );

    // Check if anything was actually modified
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Course or chapter not found' });
    }

    res.status(200).json({ message: 'Chapter deleted successfully' });
  } catch (err) {
    console.error('Error deleting chapter:', err);
    res.status(500).json({ message: 'Server error' });
  }
};