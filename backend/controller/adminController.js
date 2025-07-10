const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

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

exports.setBanStatus = async (req, res) => {
  const { id } = req.params;
  const { ban } = req.body; // true or false

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  user.isBanned = ban;
  await user.save();

  res.json({ msg: `User has been ${ban ? 'banned' : 'unbanned'}` });
};

exports.getActivityLogs = async (req, res) => {
  const logs = await ActivityLog.find().populate('userId', 'username');
  res.json(logs);
};
