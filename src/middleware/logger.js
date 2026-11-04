const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  const logMessage = `${timestamp} | ${method} ${url} | IP: ${ip} | ${userAgent}\n`;

  logStream.write(logMessage);
  console.log(logMessage.trim());

  next();
}

module.exports = logger;