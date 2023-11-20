import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateAchievementRequest {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'next cursor id' })
  where__id__less_than?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'take' })
  take: number = 12;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'categoryId' })
  categoryId: number;

  constructor(
    categoryId?: number,
    take?: number,
    where__id__less_than?: number,
  ) {
    this.categoryId = categoryId;
    this.take = take;
    this.where__id__less_than = where__id__less_than;
  }
}
