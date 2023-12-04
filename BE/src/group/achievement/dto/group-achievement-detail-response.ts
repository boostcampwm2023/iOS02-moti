import { ApiProperty } from '@nestjs/swagger';
import { IGroupAchievementDetail } from '../index';
import { AchievementDetailResponse } from '../../../achievement/dto/achievement-detail-response';

export class GroupAchievementDetailResponse extends AchievementDetailResponse {
  @ApiProperty({ description: 'usercode' })
  userCode: string;

  constructor(achievementDetail: IGroupAchievementDetail) {
    super(achievementDetail);
    this.userCode = achievementDetail.userCode;
  }
}
