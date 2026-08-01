const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// SECURITY: Validate both file extension AND MIME type
const allowedTypes = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Check file extension
  if (!allowedTypes[ext]) {
    return cb(new Error('Unsupported file type. Allowed: pdf, doc, docx, png, jpg'), false);
  }

  // SECURITY: Check MIME type to prevent disguised files
  if (!file.mimetype || !Object.values(allowedTypes).includes(file.mimetype)) {
    // Allow PDF override for older systems
    if (ext === '.pdf' && file.mimetype === 'application/octet-stream') {
      return cb(null, true);
    }
    return cb(new Error('Invalid MIME type. File may be disguised'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
