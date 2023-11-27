import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../config/config/validation-decorator';

export class ThumbnailRequest {
  @IsNotEmptyString({ message: '잘못된 썸네일 경로입니다.' })
  @ApiProperty({ description: '저장된 썸네일 경로' })
  thumbnailUrl: string;
}
