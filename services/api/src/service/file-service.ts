
import { AppError } from '../middleware/app-error.js';



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
  const processedFiles = [];

  for (const file of request.uploadedFiles) {
    const processingResult = await processDocument(
      file.blobName,
    );

    processedFiles.push({
      blobName: file.blobName,
      originalName: file.originalName,
      mimeType: file.mimeType,
      processing: processingResult,
    });
  }

  return {
    message: 'File upload success',
    files: processedFiles,
  };


};

export const processDocument = async (
  blobName: string,
) => {
  const functionUrl = process.env.AZURE_FUNCTION_URL;

  if (!functionUrl) {
    throw new Error('AZURE_FUNCTION_URL is not configured');
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      blobName,
    }),
  });

  // if (!response.ok) {
  //   throw new Error(
  //     `Function request failed: ${response.status}`,
  //   );
  // }

  return response.json();
};