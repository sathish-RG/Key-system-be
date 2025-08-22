const User = require('../models/User');

/**
 * @desc    Get all users with the 'member' role
 * @route   GET /api/admin/members
 * @access  Admin
 */
exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select('-__v');
    res.status(200).json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all users with the 'admin' role
 * @route   GET /api/admin/admins
 * @access  Admin
 */
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-__v');
    res.status(200).json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/admin/users/:userId/role
 * @access  Admin
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (req.user._id.toString() === userToUpdate._id.toString() && role === 'member') {
        return res.status(400).json({ message: 'Admins cannot demote themselves.' });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.status(200).json(userToUpdate);
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a user's access to a course
 * @route   PUT /api/admin/users/:userId/access
 * @access  Admin
 */
exports.updateCourseAccess = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId, hasAccess } = req.body;

    if (!courseId || typeof hasAccess !== 'boolean') {
      return res.status(400).json({ message: 'Course ID and access status are required.' });
    }
    
    let user;
    if (hasAccess) {
      // Add the courseId to the user's accessibleCourses array
      user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { accessibleCourses: courseId } },
        { new: true }
      );
    } else {
      // Remove the courseId from the array
      user = await User.findByIdAndUpdate(
        userId,
        { $pull: { accessibleCourses: courseId } },
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating course access:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};