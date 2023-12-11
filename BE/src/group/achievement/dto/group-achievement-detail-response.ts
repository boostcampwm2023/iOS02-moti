import { ApiProperty } from '@nestjs/swagger';
import { IGroupAchievementDetail, UserInfo } from '../index';
import { AchievementDetailResponse } from '../../../achievement/dto/achievement-detail-response';

export class GroupAchievementDetailResponse extends AchievementDetailResponse {
  @ApiProperty({ description: 'user', type: UserInfo })
  user: UserInfo;

  constructor(achievementDetail: IGroupAchievementDetail) {
    super(achievementDetail);
    this.user = new UserInfo(
      achievementDetail.userCode,
      achievementDetail.avatarUrl,
    );
  }
}
