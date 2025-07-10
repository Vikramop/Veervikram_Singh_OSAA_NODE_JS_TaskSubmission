const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'logs', 'activity.md');

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logPath))) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
}

// ✅ Write log entry to Markdown
exports.logToMarkdown = (event) => {
  const timestamp = new Date().toISOString();

  const mdEntry = `### ${event.type.toUpperCase()} (${timestamp})
- **User ID**: ${event.userId || 'N/A'}
- **Endpoint**: \`${event.endpoint || 'N/A'}\`
- **IP Address**: \`${event.ip || 'N/A'}\`
- **Status**: ${event.success ? '✅ Success' : '❌ Failure'}

`;

  fs.appendFileSync(logPath, mdEntry, 'utf8');
};
