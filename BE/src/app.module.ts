import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmModuleOptions } from './config/typeorm';
import { configServiceModuleOptions } from './config/config';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './config/transaction-manager/transaction.module';
import { OperateModule } from './operate/operate.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { AchievementModule } from './achievement/achievement.module';

@Module({
  imports: [
    ConfigModule.forRoot(configServiceModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UsersModule,
    AuthModule,
    TransactionModule,
    OperateModule,
    CategoryModule,
    AchievementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
