

/**
 * DTO for upload file request
 */
export interface IUploadFileRequestDto {
  uploadedFiles: IUploadedFile[];
}

/** 
 * upload file response
*/
export interface IUploadFileResponseDto {
  message: string;
}

/**
 * DTO for upload file
 */
export interface IUploadedFile {
  originalName: string;
  path: string;
  mimeType: string;
  etag: string;
}

