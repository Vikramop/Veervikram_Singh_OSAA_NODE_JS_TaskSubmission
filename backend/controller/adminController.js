const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { logToDb } = require('../utils/logToDb');

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
  try {
    const { id } = req.params;
    const { ban } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isBanned = ban;
    await user.save();

    // ✅ Log ban or unban action
    await logToDb({
      userId: user._id,
      username: user.username,
      type: ban ? 'user_banned' : 'user_unbanned',
      endpoint: req.originalUrl,
      ip: req.ip,
      success: true,
    });

    // ✅ Return success response for the admin
    return res.json({ msg: `User has been ${ban ? 'banned' : 'unbanned'}` });
  } catch (err) {
    console.error('Ban error:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('userId', 'username'); // populates username from User

    // transform output so frontend has username at top-level
    const transformedLogs = logs.map((log) => ({
      ...log.toObject(),
      username: log.userId?.username || 'Unknown',
    }));

    res.json(transformedLogs);
  } catch (err) {
    console.error('Failed to fetch activity logs:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
