import 'express';

declare global {
  namespace Express {
    interface Request {

      uploadedFiles: UploadedFile[];
    }
  }
}

export {};
