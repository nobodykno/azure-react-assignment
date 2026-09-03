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

