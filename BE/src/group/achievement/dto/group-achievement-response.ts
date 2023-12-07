import { ApiProperty } from '@nestjs/swagger';
import { IGroupAchievementListDetail, UserInfo } from '../index';

export class GroupAchievementResponse {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: 'thumbnailUrl' })
  thumbnailUrl: string;
  @ApiProperty({ description: 'title' })
  title: string;
  @ApiProperty({ description: 'categoryId' })
  categoryId: number;
  @ApiProperty({ description: 'user', type: UserInfo })
  user: UserInfo;
  constructor(
    id: number,
    thumbnailUrl: string,
    title: string,
    userCode: string,
    avatarUrl: string,
    categoryId: number | null,
  ) {
    this.id = id;
    this.thumbnailUrl = thumbnailUrl;
    this.title = title;
    this.user = new UserInfo(userCode, avatarUrl);
    this.categoryId = categoryId ? categoryId : -1;
  }

  static from(groupAchievementListDetail: IGroupAchievementListDetail) {
    return new GroupAchievementResponse(
      groupAchievementListDetail.id,
      groupAchievementListDetail.thumbnailUrl,
      groupAchievementListDetail.title,
      groupAchievementListDetail.userCode,
      groupAchievementListDetail.avatarUrl,
      groupAchievementListDetail.categoryId,
    );
  }
}
