import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from '../application/image.service';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { File } from '../../common/application/file-store';
import { ApiData } from '../../common/api/api-data';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { ParseFilePipe } from '../../common/pipe/parse-file.pipe';
import { ImageResponse } from '../dto/image-response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { AdminTokenGuard } from '../../auth/guard/admin-token.guard';
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';
import { ThumbnailRequest } from '../dto/thumbnail-request';

@Controller('/api/v1/images')
@ApiTags('이미지 API')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({
    summary: '이미지 업로드 API',
    description: '이미지 선업로드를 위한 API 입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '이미지 업로드 성공',
    type: ImageResponse,
  })
  @ApiBearerAuth('accessToken')
  @Post()
  @HttpCode(HttpStatusCode.Created)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(ParseFilePipe) image: File,
    @AuthenticatedUser() user: User,
  ): Promise<ApiData<ImageResponse>> {
    const savedImage = await this.imageService.saveImage(image, user);
    return ApiData.success(ImageResponse.from(savedImage));
  }

  @ApiOperation({
    summary: '썸네일 업데이트 API',
    description: '이미지의 썸네일 경로를 영속화하는 API 입니다.',
  })
  @ApiResponse({
    status: 204,
    description: '썸네일 업데이트 성공',
  })
  @Post('/:imageId/thumbnails')
  @HttpCode(HttpStatusCode.NoContent)
  @UseGuards(AdminTokenGuard)
  async uploadThumbnail(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() thumbnail: ThumbnailRequest,
  ): Promise<void> {
    await this.imageService.saveThumbnail(imageId, thumbnail.thumbnailUrl);
  }
}
