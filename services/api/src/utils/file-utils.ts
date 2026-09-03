import crypto from 'crypto';
import path from 'path';

/**
 * Returns a safe filename.
 */
const sanitizeFileName = (originalName: string): string => {
  const extension = path.extname(originalName);

  const name = path.basename(originalName, extension);

  const santizeName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${crypto.randomUUID()}-${santizeName}${extension}`;
};

export default sanitizeFileName;
