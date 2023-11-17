import { IsNumber, IsOptional } from 'class-validator';

export class PaginateAchievementRequest {
  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  @IsNumber()
  @IsOptional()
  take: number = 12;

  @IsNumber()
  @IsOptional()
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
