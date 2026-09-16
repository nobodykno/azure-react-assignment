import sequelize
from "./database.js";
import migrator
 from "./migrator.js";

 import seeder
  from "./seeder.js";

  const configFile = {
    sequelize,
    migrator,
    seeder
  }

  export default configFile;