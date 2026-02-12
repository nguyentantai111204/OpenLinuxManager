import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserManagementModule } from '../modules/user-management/user-management.module';
import { SystemMonitorModule } from '../modules/system-monitor/system-monitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserManagementModule,
    SystemMonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

