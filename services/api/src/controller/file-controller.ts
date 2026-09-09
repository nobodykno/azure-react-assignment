

import service from '../service/index.js';


import type {
  IFileParams,
  IFileRetry,
  IUploadFileRequestDto,
  IUploadFileResponseDto,
} from '../dto/request/file-request-dto.js';

import type { NextFunction, Request, Response } from 'express';
import { IFileResponse } from '../dto/response/file-response-dto.js';


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



 /**
 * @param req - accepts the fileId details matching to the request dto.
 * @param res - returning  response of file  details matching with response dto
 * @param next - Express next middleware function.
 * @returns JSON response containing uploaded file information.
 */

export const retryFiles = async (
  req: Request<IFileParams, IFileResponse, IFileRetry>,
  res: Response<IFileResponse>,
  next: NextFunction,
) => {
  try {

    const request: IFileRetry = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      fileId: Number(req.params.fileId),
    };

    const response = await service.file.retryFile(request);

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
