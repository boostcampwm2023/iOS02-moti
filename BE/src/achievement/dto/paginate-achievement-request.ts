import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateAchievementRequest {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'next cursor id', required: false })
  whereIdLessThan?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'take', required: false })
  take: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'categoryId', required: false })
  categoryId: number;

  constructor(
    categoryId?: number,
    take: number = 12,
    whereIdLessThan?: number,
  ) {
    this.categoryId = categoryId;
    this.take = take;
    this.whereIdLessThan = whereIdLessThan;
  }
}
