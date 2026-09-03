import '../config/env.js'
import migrator from '../config/migrator.js';

/**
 * Config file for controlling migration
 */
const migrate = async (): Promise<void> => {
  try {
    console.log("RUNNING MIGRATIONS");

    const migrations = await migrator.up();

    migrations.forEach((migration) => {
      console.log(`✓ ${migration.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("MIGRATION FAILED");
    console.error(error);

    process.exit(1);
  }
};

migrate();
