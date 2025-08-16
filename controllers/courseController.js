const Course = require('../models/Course'); // Adjust path if needed


// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin
exports.createCourse = async (req, res) => {
  // --- Start of Debugging ---
  console.log('--- Triggered createCourse Controller ---');
  console.log('Request Body Received:', req.body);
  console.log('Authenticated User from Middleware:', req.user);
  // --- End of Debugging ---

  try {
    const { title, description, category, image } = req.body;
    
    // Check for required data
    if (!title || !description) {
      console.log('Validation failed: Title or description is missing.');
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Check if the user object from the auth middleware is available
    if (!req.user || !req.user._id) {
        console.log('Auth error: req.user is not available from middleware.');
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const course = new Course({
      title,
      description,
      category,
      image,
      createdBy: req.user._id // This requires req.user to exist
    });
    
    console.log('Attempting to save this course object:', course);

    const createdCourse = await course.save();
    
    console.log('✅ Course saved successfully to MongoDB:', createdCourse);
    res.status(201).json(createdCourse);

  } catch (err) {
    // This will catch any errors from the .save() operation, like validation errors
    console.error('💥 ERROR while creating course:', err); 
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('createdBy', 'name');
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Admin
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, image, isPublished } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.category = category || course.category;
      course.image = image || course.image;
      course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

      const updatedCourse = await course.save();
      res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // ✅ CHANGED: Use the modern deleteOne() method instead of remove()
      await course.deleteOne();
      res.status(200).json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    // If this still fails, the error will be logged here in your server terminal
    console.error('💥 DELETE COURSE ERROR:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};