import './env.js'
import { Sequelize } from 'sequelize';

/**
 * Intialize a PostgreSQL connection  using environment variable
 */


const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',

    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    pool: {
      max: Number(process.env.DB_POOL_MAX ?? 10),
      min: Number(process.env.DB_POOL_MIN ?? 0),
      acquire: Number(process.env.DB_POOL_ACQUIRE ?? 30000),
      idle: Number(process.env.DB_POOL_IDLE ?? 10000),
    },

    retry: {
      max: Number(process.env.DB_RETRY_MAX ?? 3),
    },
  },
);

export default sequelize;
