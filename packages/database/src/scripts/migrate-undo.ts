import '../config/env.js'

import migrator from '../config/migrator.js';


/**
 * Config files to undo migration
 */

async function undoMigration() {
  try {
    const migration = await migrator.down();

    if (migration) {
      console.log("Migration undo completed");
    } else {
      console.log("Migration done");
    }
  } catch (error) {
    console.error(error);
  }
}

void undoMigration();
