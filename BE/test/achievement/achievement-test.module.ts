import { CustomTypeOrmModule } from '../../src/config/typeorm/custom-typeorm.module';
import { Module } from '@nestjs/common';
import { AchievementRepository } from '../../src/achievement/entities/achievement.repository';
import { AchievementModule } from '../../src/achievement/achievement.module';
import { AchievementFixture } from './achievement-fixture';
import { ImageTestModule } from '../image/image-test.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([AchievementRepository]),
    AchievementModule,
    ImageTestModule,
  ],
  providers: [AchievementFixture],
})
export class AchievementTestModule {}
