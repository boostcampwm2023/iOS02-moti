import { IGroupPreview } from '../index';
import { dateFormat } from '../../../common/utils/date-formatter';
import { ApiProperty } from '@nestjs/swagger';

export class GroupPreview {
  @ApiProperty({ description: '그룹 아이디' })
  id: number;
  @ApiProperty({ description: '그룹 이름' })
  name: string;
  @ApiProperty({ description: '그룹 로고 Url' })
  avatarUrl: string;
  @ApiProperty({ description: '그룹 달성기록 총 회수' })
  continued: number;
  @ApiProperty({ description: '그룹 달성기록 최근 등록 일자' })
  lastChallenged: string;

  constructor(groupPreview: IGroupPreview) {
    this.id = groupPreview.id;
    this.name = groupPreview.name;
    this.avatarUrl = groupPreview.avatarUrl;
    this.continued = parseInt(groupPreview.continued);
    this.lastChallenged = dateFormat(groupPreview.lastChallenged);
  }
}
