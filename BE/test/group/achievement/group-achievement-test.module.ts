import { CustomTypeOrmModule } from '../../../src/config/typeorm/custom-typeorm.module';
import { Module } from '@nestjs/common';
import { GroupAchievementRepository } from '../../../src/group/achievement/entities/group-achievement.repository';
import { GroupAchievementFixture } from './group-achievement-fixture';
import { ImageTestModule } from '../../image/image-test.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([GroupAchievementRepository]),
    ImageTestModule,
  ],
  providers: [GroupAchievementFixture],
  exports: [GroupAchievementFixture],
})
export class GroupAchievementTestModule {}
