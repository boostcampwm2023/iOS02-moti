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
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { AchievementModule } from './achievement/achievement.module';
import { UuidHolderModule } from './common/application/uuid-holder/uuid.module';
import { ImageModule } from './image/image.module';
import { GroupModule } from './group/group/group.module';
import { GroupCategoryModule } from './group/category/group-category.module';
import { GroupAchievementModule } from './group/achievement/group-achievement.module';
import { GroupAchievementEmojiModule } from './group/emoji/group-achievement-emoji.module';

@Module({
  imports: [
    ConfigModule.forRoot(configServiceModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UsersModule,
    AuthModule,
    TransactionModule,
    OperateModule,
    AdminModule,
    CategoryModule,
    AchievementModule,
    UuidHolderModule,
    ImageModule,
    GroupModule,
    GroupCategoryModule,
    GroupAchievementModule,
    GroupAchievementEmojiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
