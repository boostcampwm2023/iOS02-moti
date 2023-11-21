import { ApiProperty } from '@nestjs/swagger';

export class CategoryInfo {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: 'name' })
  name: string;
  @ApiProperty({ description: '회차 수' })
  round: number;
  constructor(id: number, name: string, round: number) {
    this.id = id;
    this.name = name;
    this.round = round;
  }
}
