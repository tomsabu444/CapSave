const multer = require('multer');
const { fileTypeFromBuffer } = require('file-type');

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
}).single('mediaFile');

module.exports = function validateUploadFile(req, res, next) {
  memoryUpload(req, res, async (err) => {
    if (err) {
      console.error('[UploadValidation] Multer error:', err);
      return res.status(400).json({ error: 'Upload failed', details: err.message });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!file.buffer || !Buffer.isBuffer(file.buffer)) {
      return res.status(400).json({ error: 'File buffer is missing or invalid' });
    }

    let type;
    try {
      type = await fileTypeFromBuffer(file.buffer);
    } catch (e) {
      console.error('[UploadValidation] Error reading file signature:', e);
      return res.status(400).json({ error: 'Failed to analyze file content' });
    }

    if (!type || !allowedMimeTypes.includes(type.mime)) {
      console.warn('[UploadValidation] Rejected file:', {
        name: file.originalname,
        mime: type?.mime || 'unknown',
      });

      return res.status(400).json({
        error: 'Unsupported or invalid file type',
        detected: type?.mime || 'unknown',
      });
    }

    // Add verified info to request for future use
    req.file.verifiedMime = type.mime;
    req.file.verifiedExt = type.ext;

    next();
  });
};
