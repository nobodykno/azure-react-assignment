import { DataTypes } from 'sequelize';

import type { QueryInterface } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.createTable('files', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
  
      type: {
        type: DataTypes.STRING(355),
        allowNull: true,
      },
  
      process_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    
      process_by: {
        type: DataTypes.STRING(355),
        allowNull: true,
      },

      path: {
        type: DataTypes.STRING(355),
        allowNull: true,
      }
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.dropTable('files');
};
