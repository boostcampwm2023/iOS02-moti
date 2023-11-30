import { GroupPreview } from './group-preview.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GroupListResponse {
  @ApiProperty({ description: '그룹 목록', type: [GroupPreview] })
  data: GroupPreview[];

  constructor(groupPreviews: GroupPreview[]) {
    this.data = groupPreviews;
  }
}
