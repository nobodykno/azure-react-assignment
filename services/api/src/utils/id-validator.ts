
import { AppError } from '../middleware/app-error.js';

/**
 * Ensures a file ID is provided.
 */

const validateFileId = (fileId?: number): void => {
  if (!fileId) {
    throw new AppError("File not found", 400);
  }
};



const idValidators = {
  validateFileId,
};

export default idValidators;
