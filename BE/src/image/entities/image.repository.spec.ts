import { ImageRepository } from './image.repository';
import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { Image } from '../domain/image.domain';
import { transactionTest } from '../../../test/common/transaction-test';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { ImageModule } from '../image.module';

describe('ImageRepository', () => {
  let imageRepository: ImageRepository;
  let dataSource: DataSource;
  let userFixture: UsersFixture;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        ConfigModule.forRoot(configServiceModuleOptions),
        AchievementTestModule,
        UsersTestModule,
        ImageModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    imageRepository = app.get<ImageRepository>(ImageRepository);
    dataSource = app.get<DataSource>(DataSource);
    userFixture = app.get<UsersFixture>(UsersFixture);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('imageRepository가 정의되어 있어야 한다.', () => {
      expect(imageRepository).toBeDefined();
    });
  });

  describe('saveImage는 이미지를 저장할 수 있다.', () => {
    it('achievement가 없는 이미지를 저장할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const image = new Image(user);
        image.originalName = 'image1.jpg';
        image.imageUrl = 'file://abcd-efgh-ijkl-mnop.jpg';

        // when
        const savedImage = await imageRepository.saveImage(image);

        // then
        expect(savedImage.id).toBeDefined();
        expect(savedImage.user).toBeNull();
        expect(savedImage.originalName).toEqual('image1.jpg');
        expect(savedImage.imageUrl).toEqual('file://abcd-efgh-ijkl-mnop.jpg');
        expect(savedImage.thumbnailUrl).toBeNull();
        expect(savedImage.achievement).toBeNull();
      });
    });
  });
});
