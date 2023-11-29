import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../domain/group.domain';

export class GroupResponse {
  @ApiProperty({ description: '그룹 아이디' })
  id: number;

  @ApiProperty({ description: '그룹 이름' })
  name: string;

  @ApiProperty({ description: '그룹 로고 이미지 url' })
  avatarUrl: string;

  constructor(id: number, name: string, avatarUrl?: string) {
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl || null;
  }

  static from(group: Group) {
    return new GroupResponse(group.id, group.name, group.avatarUrl);
  }
}
