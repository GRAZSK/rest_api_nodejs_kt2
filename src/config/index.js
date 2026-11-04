require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads/products'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',')
};