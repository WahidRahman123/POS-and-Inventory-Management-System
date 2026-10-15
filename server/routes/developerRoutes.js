const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const { verifyDeveloperKey } = require('../middleware/authMiddleware');
const {
  register,
  getUsers,
  backupToDrive,
  restoreFromUpload,
  restoreFromDrive,
  getGoogleAuthUrl,
  googleOAuthCallback,
} = require('../controllers/developer');

const router = express.Router();

// Multer config (store in temp)
const upload = multer({
  dest: path.join(os.tmpdir(), 'mern-backup-uploads'),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  },
});

// OAuth routes (no developer key needed for first-time auth)
router.get('/auth-url', getGoogleAuthUrl);
router.get('/oauth2callback', googleOAuthCallback);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Protected routes
router.get('/', verifyDeveloperKey, getUsers);
router.post('/register', verifyDeveloperKey, register);
router.post('/backup', verifyDeveloperKey, backupToDrive);
router.post('/restore/upload', verifyDeveloperKey, upload.single('backup'), restoreFromUpload);
router.post('/restore/drive', verifyDeveloperKey, restoreFromDrive);

module.exports = router;