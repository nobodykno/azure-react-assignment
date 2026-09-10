/**
 * DTO for file type
 */

export interface IFileDto {
  id: number;
  processing_date: Date;
  process_by: string;
  type: string;
  path: string;
}

export interface IFileResponse {
  message: string;
}



export interface IGetFileResponse {
  data: IFile[];
}

export interface IFile {
  id: number;
  path: string;
  type: string;
  processing_date: Date | null;
  process_by: string | null;

  bp_measure: string | null;
  bp_measure_date: Date | null;

  a1c_measure: string | null;
  a1c_measure_date: Date | null;

  status: string;
}

export type ProcessingStatus =
  | 'Processing'
  | 'Success'
  | 'Needs Review'
  | 'Failed';