
import { AppError } from '../middleware/app-error.js';

import repository from 'azure-db/repositories';

import type {
  IUploadFileRequestDto,
  IUploadFileResponseDto,
} from '../dto/request/file-request-dto.js';




/**
 *
 * @param request - Upload file request data.
 * @returns Details of the uploaded files.
 * @throws {AppError} If no files are provided.
 */

export const uploadFilesService = async (
  request: IUploadFileRequestDto,
): Promise<IUploadFileResponseDto> => {


  if (!request.uploadedFiles.length) {


    throw new AppError(
     "No file uploaded", 400
    );
  }

  // const files = request.uploadedFiles.map((file) => ({
  //   name: file.originalName,
  //   file_name: file.originalName,
  //   size: file.size,
  //   mime_type: file.mimeType,
  //   path: file.objectName,
  //   thumbnail_image: '',
  //   type: file.mimeType.startsWith('image/') ? 'image' : 'document',
  // }));

  // const createdFiles = await repository.fileRepository.createFile(files);




  const response: IUploadFileResponseDto = {
    message: "File upload success",
  };

  return response;
};

