const ActivityLog = require('../models/ActivityLog');

async function logToDb({
  userId = null,
  username = 'Unknown',
  type,
  endpoint,
  ip,
  success,
}) {
  try {
    await ActivityLog.create({
      userId,
      username,
      type,
      endpoint,
      ip,
      success,
    });
  } catch (err) {
    console.error('ActivityLog DB error:', err.message);
  }
}

module.exports = { logToDb };
