const Course = require('../models/Course');

// @desc    Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, image } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const course = new Course({
      title,
      description,
      category,
      image,
      createdBy: req.user._id
    });
    
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);

  } catch (err) {
    console.error('Error creating course:', err); 
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getMemberCourses = async (req, res) => {
  console.log('--- ✅ 1. getMemberCourses controller was hit ---');
  try {
    // Let's see what the auth middleware provides
    console.log('--- 2. User object from auth middleware:', req.user);
    
    if (!req.user || !req.user.accessibleCourses) {
      console.log('--- ❌ 3a. User not found or has no accessibleCourses array.');
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const accessibleIds = req.user.accessibleCourses;
    console.log('--- 3b. User has access to course IDs:', accessibleIds);

    // Find all courses whose _id is in the user's access list
    const courses = await Course.find({ 
      '_id': { $in: accessibleIds } 
    }).populate('createdBy', 'name');
    
    console.log(`--- 4. Found ${courses.length} courses matching those IDs.`);
    res.status(200).json(courses);

  } catch (err) {
    console.error('--- 💥 5. An error occurred in getMemberCourses ---', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('createdBy', 'name');
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error getting all courses:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error('Error getting course by ID:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, image, isPublished } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = title !== undefined ? title : course.title;
      course.description = description !== undefined ? description : course.description;
      course.category = category !== undefined ? category : course.category;
      course.image = image !== undefined ? image : course.image;
      course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

      const updatedCourse = await course.save();
      res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.status(200).json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};