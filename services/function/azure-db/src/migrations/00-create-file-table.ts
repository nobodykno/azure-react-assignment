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
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.dropTable('files');
};