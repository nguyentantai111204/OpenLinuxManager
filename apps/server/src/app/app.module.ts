import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemMonitorService } from './system-monitor/system-monitor.service';
import { SystemGateway } from './system-monitor/system.gateway';
import { UserManagementService } from './user-management/user-management.service';
import { SystemMonitorController } from './system-monitor/system-monitor.controller';
import { UserManagementController } from './user-management/user-management.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM will be enabled in Phase 2 when we need database for User Management
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: configService.get('DB_PORT', 5432),
    //     username: configService.get('DB_USERNAME', 'postgres'),
    //     password: configService.get('DB_PASSWORD', 'postgres'),
    //     database: configService.get('DB_DATABASE', 'openlinuxmanager'),
    //     entities: [],
    //     synchronize: configService.get('NODE_ENV') !== 'production',
    //     logging: configService.get('NODE_ENV') === 'development',
    //   }),
    // }),
  ],
  controllers: [AppController, SystemMonitorController, UserManagementController],
  providers: [AppService, SystemMonitorService, SystemGateway, UserManagementService],
})
export class AppModule { }
