import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationRunnerService {
  private readonly logger = new Logger(MigrationRunnerService.name);

  constructor(private readonly dataSource: DataSource) {}

  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Running database migrations...');
      
      const pendingMigrations = await this.dataSource.showMigrations();
      if (pendingMigrations) {
        await this.dataSource.runMigrations();
        this.logger.log('Database migrations completed successfully');
      } else {
        this.logger.log('No pending migrations found');
      }
    } catch (error) {
      this.logger.error('Failed to run migrations', error);
      throw error;
    }
  }
}
