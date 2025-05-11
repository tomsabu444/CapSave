import { toast } from 'react-toastify';

export const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska'
];

export function validateFile(file) {
  if (!file) return { valid: false, reason: 'No file selected' };

  if (file.size > MAX_SIZE_BYTES) {
    const msg = `"${file.name}" exceeds ${MAX_SIZE_MB}MB`;
    toast.error(msg);
    return { valid: false, reason: `File size must be under ${MAX_SIZE_MB}MB` };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    const msg = `"${file.name}" is not a supported format`;
    toast.error(msg);
    return {
      valid: false,
      reason: `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(', ')}`,
    };
  }

  return { valid: true };
}
