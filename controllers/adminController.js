const User = require('../models/User'); // Adjust path to your User model

/**
 * @desc    Get all users with the 'member' role
 * @route   GET /api/admin/members
 * @access  Admin
 */
exports.getAllMembers = async (req, res) => {
  try {
    // Find all users where the role is 'member'
    // .select('-password') can be used to exclude fields, though you don't have one
    const members = await User.find({ role: 'member' }).select('-__v');
    
    res.status(200).json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ ADD THIS FUNCTION to get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-__v');
    res.status(200).json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ ADD THIS FUNCTION to update a user's role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.userId;

    // Validate the role
    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent an admin from demoting themselves
    if (req.user.id === userToUpdate.id && role === 'member') {
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