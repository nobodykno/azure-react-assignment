import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';


class DatabaseService {
  private readonly sequelize: Sequelize;

  constructor() {
    this.sequelize = sequelize;
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
  }

  async disconnect(): Promise<void> {
    await this.sequelize.close();
  }

  getInstance(): Sequelize {
    return this.sequelize;
  }

  async transaction() {
    return this.sequelize.transaction();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch {
      return false;
    }
  }
}

export default new DatabaseService();