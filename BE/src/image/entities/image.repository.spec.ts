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
import { ImageTestModule } from '../../../test/image/image-test.module';
import { ImageFixture } from '../../../test/image/image-fixture';

describe('ImageRepository', () => {
  let imageRepository: ImageRepository;
  let dataSource: DataSource;
  let userFixture: UsersFixture;
  let imageFixture: ImageFixture;

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
    }).compile();

    imageRepository = app.get<ImageRepository>(ImageRepository);
    dataSource = app.get<DataSource>(DataSource);
    userFixture = app.get<UsersFixture>(UsersFixture);
    imageFixture = app.get<ImageFixture>(ImageFixture);
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
        image.imageKey = 'abcd-efgh-ijkl-mnop-deadbeef';

        // when
        const savedImage = await imageRepository.saveImage(image);

        // then
        expect(savedImage.id).toBeDefined();
        expect(savedImage.user).toEqual(user);
        expect(savedImage.originalName).toEqual('image1.jpg');
        expect(savedImage.imageUrl).toEqual('file://abcd-efgh-ijkl-mnop.jpg');
        expect(savedImage.imageKey).toEqual('abcd-efgh-ijkl-mnop-deadbeef');
        expect(savedImage.thumbnailUrl).toBeNull();
        expect(savedImage.achievement).toBeNull();
      });
    });

    it('기존 이미지의 데이터를 업데이트 할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const image = await imageFixture.getImage(user);
        image.updateThumbnail('file://abcd-efgh-ijkl-mnop.jpg');
        image.imageKey = 'abcd-efgh-ijkl-mnop-deadbeef';

        // when
        const savedImage = await imageRepository.saveImage(image);

        // then
        expect(savedImage.id).toEqual(image.id);
        expect(savedImage.user).toEqual(user);
        expect(savedImage.originalName).toEqual(image.originalName);
        expect(savedImage.imageUrl).toEqual(image.imageUrl);
        expect(savedImage.thumbnailUrl).toEqual(
          'file://abcd-efgh-ijkl-mnop.jpg',
        );
        expect(savedImage.imageKey).toEqual('abcd-efgh-ijkl-mnop-deadbeef');
        expect(savedImage.achievement).toBeNull();
      });
    });
  });

  describe('findById는 이미지를 조회할 수 있다.', () => {
    it('이미지 조회에 성공하면 이미지 도메인 인스턴스를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const image = new Image(user);
        image.originalName = 'image1.jpg';
        image.imageUrl = 'file://abcd-efgh-ijkl-mnop.jpg';
        image.imageKey = 'abcd-efgh-ijkl-mnop-deadbeef';
        const savedImage = await imageRepository.saveImage(image);

        // when
        const findImage = await imageRepository.findById(savedImage.id);

        // then
        expect(findImage.id).toEqual(savedImage.id);
        expect(findImage.user).toBeNull();
        expect(findImage.originalName).toEqual('image1.jpg');
        expect(findImage.imageKey).toEqual('abcd-efgh-ijkl-mnop-deadbeef');
        expect(findImage.thumbnailUrl).toBeNull();
        expect(findImage.thumbnailUrl).toBeNull();
        expect(findImage.achievement).toBeNull();
      });
    });

    it('이미지 조회에 실패하면 null을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        // when
        const findImage = await imageRepository.findById(1000);

        // then
        expect(findImage).toBeUndefined();
      });
    });
  });

  describe('findByImageKey는 이미지를 조회할 수 있다.', () => {
    it('이미지 조회에 성공하면 이미지 도메인 인스턴스를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const image = new Image(user);
        image.originalName = 'image1.jpg';
        image.imageUrl = 'file://abcd-efgh-ijkl-mnop.jpg';
        image.imageKey = 'abcd-efgh-ijkl-mnop-deadbeef';
        const savedImage = await imageRepository.saveImage(image);

        // when
        const findImage = await imageRepository.findByImageKey(
          savedImage.imageKey,
        );

        // then
        expect(findImage.id).toEqual(savedImage.id);
        expect(findImage.user).toBeNull();
        expect(findImage.originalName).toEqual('image1.jpg');
        expect(findImage.imageKey).toEqual('abcd-efgh-ijkl-mnop-deadbeef');
        expect(findImage.thumbnailUrl).toBeNull();
        expect(findImage.thumbnailUrl).toBeNull();
        expect(findImage.achievement).toBeNull();
      });
    });

    it('이미지 조회에 실패하면 null을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        // when
        const findImage = await imageRepository.findByImageKey('abcd-efgh');

        // then
        expect(findImage).toBeUndefined();
      });
    });
  });
});
