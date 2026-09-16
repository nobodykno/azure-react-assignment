import './env.js'
import { SequelizeStorage, Umzug } from 'umzug';
import sequelize from './database.js';




/**
 * Configure Umzug  to control migration
 */
const migrator = new Umzug({
  migrations: {
    glob: 'src/migrations/*.ts',
  },

  context: sequelize.getQueryInterface(),

  storage: new SequelizeStorage({
    sequelize,
  }),

  logger: console,
});

export default migrator;
