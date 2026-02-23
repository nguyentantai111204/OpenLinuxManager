import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserManagementModule } from '../modules/user-management/user-management.module';
import { SystemMonitorModule } from '../modules/system-monitor/system-monitor.module';
import { AuditLogModule } from '../modules/audit-log/audit-log.module';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { ServiceManagerModule } from '../modules/service-manager/service-manager.module';
import { TerminalModule } from '../modules/terminal/terminal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client'), // In production, it will be in the same root
      exclude: ['/api/(.*)'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'open_linux_manager'),
        autoLoadEntities: true,
        synchronize: true, // Only for development!
      }),
    }),
    UserManagementModule,
    SystemMonitorModule,
    AuditLogModule,
    ServiceManagerModule,
    TerminalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule { }

