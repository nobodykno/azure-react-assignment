
import { AppError } from '../middleware/app-error.js';



import type {
  IFileRetry,
  IUploadFileRequestDto,
  IUploadFileResponseDto,
} from '../dto/request/file-request-dto.js';
import repository from 'azure-db/repositories';
import { IFileResponse, IGetFileResponse } from '../dto/response/file-response-dto.js';
import model from 'azure-db/models';




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

  const processedFiles = [];

  for (const file of request.uploadedFiles) {


    const createdFile = await repository.fileRepository.createFile({
      path: file.blobName,
      type: file.mimeType,
      processing_date: new Date(),
      process_by: 'Azure Function',
      bp_measure: null,
      bp_measure_date: null,
      a1c_measure: null,
      a1c_measure_date: null,
      status: 'Processing',
    });


    await processDocument(
      file.blobName,
      file.originalName,
      file.mimeType,
    );

    processedFiles.push({
      id: createdFile.id,
      blobName: file.blobName,
      originalName: file.originalName,
      mimeType: file.mimeType,
      status: 'Processing',
    });
  }

  return {
    message: 'File upload success',
    files: processedFiles,
  };


};


/**
 *
 * @param request - fileId.
 * @returns Success message of retrying a file.
 * @throws {AppError} If no files are provided.
 */

export const retryFile = async (
 request: IFileRetry,
): Promise<IFileResponse> => {


  const file = await repository.fileRepository.findFileByPrimaryKey(request.fileId);

  if(!file){
    throw new AppError(
      "No file uploaded", 400
     );
  }

  await processDocument(
    file.path,
    'updated_file',
    'application/pdf',
  );

  await model.File.update(
    {
      status: 'Processing',
    },
    {
      where: {
        id: request.fileId,
      },
    },
  );




 return {
   message: 'File upload success',
 };


};


/**
 * Get all processed files.
 *
 * @returns List of files with their processing results.
 */
export const getFiles = async (): Promise<IGetFileResponse> => {
  const files = await repository.fileRepository.getFiles();

  return {
    data: files
  };
};

export const processDocument = async (
  blobName: string,
  originalName: string,
  mimeType: string,
) => {
  const logicAppUrl = process.env.LOGIC_APP_URL;

  if (!logicAppUrl) {
    throw new Error('LOGIC_APP_URL is not configured');
  }

  console.log('Calling Logic App...');

  const response = await fetch(logicAppUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      blobName,
      originalName,
      mimeType,
    }),
  });

  console.log('Logic App response:', response.status);

  const responseText = await response.text();

  console.log('Logic App response body:', responseText);

  if (!response.ok) {
    throw new Error(
      `Logic App request failed: ${response.status} ${responseText}`,
    );
  }

  return {
    submitted: true,
    status: response.status,
    response: responseText,
  };
};