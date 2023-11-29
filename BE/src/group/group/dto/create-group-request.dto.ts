import { IsNotEmptyString } from '../../../config/config/validation-decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Group } from '../domain/group.domain';

export class CreateGroupRequest {
  @IsNotEmptyString({ message: '잘못된 그룹 이름입니다.' })
  @ApiProperty({ description: '그룹 이름' })
  name: string;

  @IsOptional()
  @ApiProperty({ description: '그룹 로고 이미지 url' })
  avatarUrl: string;

  constructor(name: string, avatarUrl: string) {
    this.name = name;
    this.avatarUrl = avatarUrl;
  }

  toModel(): Group {
    return new Group(this.name, this.avatarUrl);
  }
}
