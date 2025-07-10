const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const logPath = path.join(__dirname, '../logs/activity.log');
const hashPath = path.join(__dirname, '../logs/logHashes.json');

exports.logActivity = (entry) => {
  const log = `[${new Date().toISOString()}] ${JSON.stringify(entry)}\n`;
  fs.appendFileSync(logPath, log);
};

exports.hashLogFile = () => {
  const content = fs.readFileSync(logPath);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const data = { hash, date: new Date().toISOString() };
  fs.writeFileSync(hashPath, JSON.stringify(data, null, 2));
};
