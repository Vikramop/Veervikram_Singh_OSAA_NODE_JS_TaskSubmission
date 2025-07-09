const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const users = await User.find({}, '-passcode');
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!updatedUser) return res.status(404).json({ msg: 'User not found' });

  res.json({ msg: 'User role updated', user: updatedUser });
};
