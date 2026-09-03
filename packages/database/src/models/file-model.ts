import { DataTypes, Model } from 'sequelize';



import type { IFileAttributes, IFileCreationAttributes } from '../types/file-type.js';
import sequelize from '../config/database.js';

/**
 * File model to take file data
 */

class File extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
  declare id: number;
  declare process_by: string;
  declare processing_date: Date;
  declare type: string;
  declare path: string;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    processing_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    process_by: {
      type: DataTypes.STRING(255),
      defaultValue: DataTypes.NOW,
    },

    path: {
      type: DataTypes.STRING(255),
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: false,
  },
);

export default File;
