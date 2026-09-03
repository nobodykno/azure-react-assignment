

import service from '../service/index.js';


import type {
  IUploadFileRequestDto,
  IUploadFileResponseDto,
} from '../dto/request/file-request-dto.js';

import type { NextFunction, Request, Response } from 'express';

/**
 * @param req - accepts the userid and uploaded files details matching to the request dto.
 * @param res - returning  response of file uploaded details matching with response dto
 * @param next - Express next middleware function.
 * @returns JSON response containing uploaded file information.
 */

export const uploadFiles = async (
  req: Request<object, IUploadFileResponseDto, IUploadFileRequestDto>,
  res: Response<IUploadFileResponseDto>,
  next: NextFunction,
) => {
  try {

    console.log("request",req)
    const request: IUploadFileRequestDto = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploadedFiles: req.uploadedFiles,
    };


    console.log("Uploaded files",request)
    const response = await service.file.uploadFilesService(request);

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

