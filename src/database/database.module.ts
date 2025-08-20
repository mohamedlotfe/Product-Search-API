import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MigrationRunnerService } from './migration-runner.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: parseInt(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'postgres',
        database: configService.get('DB_NAME') || 'catalog',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*.ts'],
        synchronize: false, // Disable synchronize in production
        logging: configService.get('NODE_ENV') === 'development',
        migrationsRun: false, // Don't run migrations automatically
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MigrationRunnerService],
  exports: [MigrationRunnerService],
})
export class DatabaseModule {}
