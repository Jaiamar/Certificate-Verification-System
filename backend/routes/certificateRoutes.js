const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  uploadCertificates,
  searchCertificate,
  downloadCertificate,
  getAllCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
  getDashboardStats,
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
  },
});

// ─── Public Routes ───────────────────────────────────────────────────────────
router.get('/search/:certificateId', searchCertificate);
router.get('/:certificateId/download', downloadCertificate);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
router.get('/stats/dashboard', protect, authorize('admin'), getDashboardStats);
router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadCertificates);
router.get('/', protect, authorize('admin'), getAllCertificates);
router.get('/:id', protect, authorize('admin'), getCertificate);
router.put('/:id', protect, authorize('admin'), updateCertificate);
router.delete('/:id', protect, authorize('admin'), deleteCertificate);

module.exports = router;
