import { Op } from 'sequelize';

import model from '../models/index.js';


import type { IFileCreationAttributes } from '../types/file-type.js';


const createFile = (file: IFileCreationAttributes) => {
  return model.File.create(file);
};




/**
 * 
 * @param fileId accepts fileId 
 * @param path accepts file path
 * @param transaction accepts transction
 * 
 */
const updateFilePath = (fileId: number, path: string) =>
  model.File.update(
    { path: path },
    {
      where: {
        id: fileId,
      },
    },
  );

  /**
   * 
   * @param fileId accepts fileId 
   * @returns JSON containing  file details
   */

const findFileByPrimaryKey = (fileId: number) => {
  return model.File.findByPk(fileId);
};








const fileRepository = {
  createFile,
  updateFilePath,
  findFileByPrimaryKey,
};

export default fileRepository;
