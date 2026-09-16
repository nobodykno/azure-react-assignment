import { DataTypes, Model } from 'sequelize';

import type {
  IFileAttributes,
  IFileCreationAttributes,
} from '../types/file-type.js';

import sequelize from '../config/database.js';

/**
 * File model to store uploaded document and processing results.
 */
class File
  extends Model<IFileAttributes, IFileCreationAttributes>
  implements IFileAttributes
{
  declare id: number;
  declare path: string;
  declare type: string;
  declare processing_date: Date;
  declare process_by: string | null;

  declare bp_measure: string | null;
  declare bp_measure_date: Date | null;

  declare a1c_measure: string | null;
  declare a1c_measure_date: Date | null;

  declare status: string;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    path: {
      type: DataTypes.STRING(355),
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    processing_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    process_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    bp_measure: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    bp_measure_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    a1c_measure: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    a1c_measure_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Processing',
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: false,
  },
);

export default File;