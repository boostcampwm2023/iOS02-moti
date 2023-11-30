import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { ImageModule } from '../image.module';
import { ImageService } from './image.service';
import { StubUuidHolder } from '../../../test/common/uuid-holder/stub-uuid-holder';
import { UuidHolder } from '../../common/application/uuid-holder';
import { FileFixture } from '../../../test/common/file-store/file-fixture';
import { transactionTest } from '../../../test/common/transaction-test';
import * as fs from 'fs/promises';
import { ImageTestModule } from '../../../test/image/image-test.module';
import { ImageFixture } from '../../../test/image/image-fixture';
import { ImageAlreadyExistsThumbnailException } from '../exception/image-already-exists-thumbnail.exception';
import { ImageNotFoundException } from '../exception/image-not-found.exception';

describe('ImageService', () => {
  let imageService: ImageService;
  let dataSource: DataSource;
  let userFixture: UsersFixture;
  let uuidHolder: StubUuidHolder;
  let imageFixture: ImageFixture;
  let imagePrefix: string;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        ConfigModule.forRoot(configServiceModuleOptions),
        AchievementTestModule,
        UsersTestModule,
        ImageModule,
        ImageTestModule,
      ],
      controllers: [],
      providers: [],
    })
      .overrideProvider(UuidHolder)
      .useClass(StubUuidHolder)
      .compile();

    uuidHolder = app.get<StubUuidHolder>(UuidHolder);
    imageService = app.get<ImageService>(ImageService);
    dataSource = app.get<DataSource>(DataSource);
    userFixture = app.get<UsersFixture>(UsersFixture);
    imageFixture = app.get<ImageFixture>(ImageFixture);
    imagePrefix = app
      .get<ConfigService>(ConfigService)
      .get<string>('FILESTORE_IMAGE_PREFIX');
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    await fs.rm(imagePrefix, { recursive: true, force: true });
  });

  describe('테스트 환경 확인', () => {
    it('imageService가 정의되어 있어야 한다.', () => {
      expect(imageService).toBeDefined();
    });
  });

  it('saveImage는 이미지를 저장할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      uuidHolder.setUuid('abcd-efgh-ijkl-mnop');
      const user = await userFixture.getUser('ABC');
      const file = FileFixture.file('img1', 'jpg');

      // when
      const savedImage = await imageService.saveImage(file, user);

      // then
      expect(savedImage.id).toBeDefined();
      expect(savedImage.user).toEqual(user);
      expect(savedImage.originalName).toBe('img1.jpg');
      expect(savedImage.imageUrl.startsWith('file://'));
      expect(savedImage.imageUrl.endsWith('abcd-efgh-ijkl-mnop.jpg'));
      expect(savedImage.thumbnailUrl).toBeNull();
      expect(savedImage.achievement).toBeUndefined();
      await expect(
        fs.access(savedImage.imageUrl.replace('file://', '')),
      ).resolves.toBeUndefined();
    });
  });

  describe('saveThumbnail은 이미지의 썸네일을 업데이트 할 수 있다.', () => {
    it('기존 이미지의 썸네일을 저장할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        uuidHolder.setUuid('abcd-efgh-ijkl-mnop');
        const user = await userFixture.getUser('ABC');
        const image = await imageFixture.getImageWithRealFile(
          user,
          imagePrefix,
        );
        const thumbnailPath = 'file://abcd-efgh-ijkl-mnop-thumbnail.jpg';

        // when
        const updatedImage = await imageService.saveThumbnail(
          image.imageKey,
          thumbnailPath,
        );

        // then
        expect(updatedImage.id).toEqual(image.id);
        expect(updatedImage.user).toBeUndefined();
        expect(updatedImage.originalName).toBe(image.originalName);
        expect(updatedImage.imageUrl.startsWith('file://'));
        expect(updatedImage.imageUrl.endsWith('abcd-efgh-ijkl-mnop.jpg'));
        expect(updatedImage.thumbnailUrl).toBe(thumbnailPath);
        expect(updatedImage.achievement).toBeUndefined();
      });
    });

    it('이미 썸네일이 있는 이미지의 썸네일을 저장할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        uuidHolder.setUuid('abcd-efgh-ijkl-mnop');
        const user = await userFixture.getUser('ABC');
        const image = await imageFixture.getImageWithRealFile(
          user,
          imagePrefix,
        );
        const thumbnailPath = 'file://abcd-efgh-ijkl-mnop-thumbnail.jpg';
        await imageService.saveThumbnail(image.imageKey, thumbnailPath);

        // when
        await expect(
          imageService.saveThumbnail(image.imageKey, thumbnailPath),
        ).rejects.toThrow(ImageAlreadyExistsThumbnailException);
      });
    });

    it('존재하지 않는 이미지의 썸네일을 저장할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        // when
        // then
        await expect(
          imageService.saveThumbnail(
            'hi',
            'file://abcd-efgh-ijkl-mnop-thumbnail.jpg',
          ),
        ).rejects.toThrow(ImageNotFoundException);
      });
    });
  });
});
