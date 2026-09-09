import type { Optional } from 'sequelize';

export interface IFileAttributes {
  id: number;
  processing_date: Date;
  process_by: string | null;
  type: string;
  path: string;

  bp_measure: string | null;
  bp_measure_date: Date | null;

  a1c_measure: string | null;
  a1c_measure_date: Date | null;

  status: string;
}

export type IFileCreationAttributes = Optional<
  IFileAttributes,
  | 'id'
  | 'processing_date'
  | 'process_by'
  | 'type'
  | 'path'
  | 'bp_measure'
  | 'bp_measure_date'
  | 'a1c_measure'
  | 'a1c_measure_date'
  | 'status'
>;