const User = require('../models/User');

exports.approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByIdAndUpdate(studentId, { approved: true }, { new: true });

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student approved", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
