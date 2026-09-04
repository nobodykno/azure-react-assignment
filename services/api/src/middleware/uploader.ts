

import busboy from 'busboy';


import { AppError } from './app-error.js';

import type { NextFunction, Request, Response } from 'express';
import { uploadToBlobStorage } from '../service/blob-storage-service.js';

/**
 *
 * @param req
 * @param res
 * @param next
 *
 * Upload middleware to accept files of given types
 */


export const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const uploads: Promise<void>[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadedFiles: any[] = [];

  let uploadError: Error | null = null;

  const allowedMimeTypes = new Set([
    'application/pdf',
  ]);

  const bb = busboy({
    headers: req.headers,
  });

  bb.on('file', (_fieldname, file, info) => {
    const { filename, mimeType } = info;

    if (!allowedMimeTypes.has(mimeType)) {
      uploadError = new AppError('Unsupported file type.', 400);
      file.resume();

      return;
    }



    uploads.push(
      uploadToBlobStorage(
        file,
        filename,
        mimeType,
      ).then((result) => {
        uploadedFiles.push(result);
      }).catch(error =>{
        console.log("error",error);
      }),
    );


  });

  bb.on('error', next);

  bb.on('finish', async () => {
    console.log("Finish")
    if (uploadError) {
      return next(uploadError);
    }

    try {
      await Promise.all(uploads);

      req.uploadedFiles = uploadedFiles;

      next();
    } catch (err) {

      next(err);
    }
  });

  req.pipe(bb);
};

