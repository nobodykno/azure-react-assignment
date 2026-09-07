import type { Optional } from 'sequelize';

export interface IFileAttributes {
  id: number;
  processing_date: Date;
  process_by: string;
  type: string;
  path: string;
  measure: string;
  measure_Date: string;
}

export type IFileCreationAttributes = Optional<
  IFileAttributes,
  'id' | 'processing_date' | 'process_by' | 'type' | 'path' | 'measure' | 'measure_Date'
>;
