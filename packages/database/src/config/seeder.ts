import './env.js'
import { SequelizeStorage, Umzug } from 'umzug';
import sequelize from './database.js';


/**
 * Configure Umzug  to control seeder
 */
const seeder = new Umzug({
  migrations: {
    glob: 'src/seeders/*.ts',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'SequelizeSeedMeta',
  }),
  logger: console,
});

export default seeder;
