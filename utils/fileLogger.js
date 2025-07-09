const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs', 'activity.log');

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

exports.logToFile = (logObj) => {
  const entry = {
    ...logObj,
    timestamp: new Date().toISOString(),
  };

  fs.appendFileSync(logFilePath, JSON.stringify(entry) + '\n', 'utf8');
};
