

/**
 * DTO for upload file request
 */
export interface IUploadFileRequestDto {
  uploadedFiles: IUploadedFile[];
}

/** 
 * upload file response
*/
export interface IUploadedFileResponse {
  blobName: string;
  originalName: string;
  mimeType: string;
}

export interface IUploadFileResponseDto {
  message: string;
  files: IUploadedFileResponse[];
}

/**
 * DTO for upload file
 */
export interface IUploadedFile {
  blobName: string;
  originalName: string;
  mimeType: string;
}

