import { Test, TestingModule } from '@nestjs/testing';
import { AchievementService } from './achievement.service';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { AchievementRepository } from '../entities/achievement.repository';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { UsersFixture } from '../../../test/user/users-fixture';
import { CategoryFixture } from '../../../test/category/category-fixture';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { CategoryTestModule } from '../../../test/category/category-test.module';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { NoSuchAchievementException } from '../exception/no-such-achievement.exception';
import { DataSource } from 'typeorm';
import { AchievementUpdateRequest } from '../dto/achievement-update-request';
import { CategoryRepository } from '../../category/entities/category.repository';
import { InvalidCategoryException } from '../exception/invalid-category.exception';
import { ImageTestModule } from '../../../test/image/image-test.module';
import { ImageRepository } from '../../image/entities/image.repository';
import { AchievementCreateRequest } from '../dto/achievement-create-request';
import { ImageFixture } from '../../../test/image/image-fixture';
import { NoUserImageException } from '../exception/no-user-image-exception';
import { transactionTest } from '../../../test/common/transaction-test';

describe('AchievementService Test', () => {
  let achievementService: AchievementService;
  let achievementRepository: AchievementRepository;
  let usersFixture: UsersFixture;
  let categoryFixture: CategoryFixture;
  let achievementFixture: AchievementFixture;
  let imageFixture: ImageFixture;
  let imageRepository: ImageRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([
          AchievementRepository,
          CategoryRepository,
          ImageRepository,
        ]),
        UsersTestModule,
        CategoryTestModule,
        AchievementTestModule,
        ImageTestModule,
      ],
      providers: [AchievementService],
    }).compile();

    achievementService = module.get<AchievementService>(AchievementService);
    achievementRepository = module.get<AchievementRepository>(
      AchievementRepository,
    );

    imageRepository = module.get<ImageRepository>(ImageRepository);
    imageFixture = module.get<ImageFixture>(ImageFixture);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    categoryFixture = module.get<CategoryFixture>(CategoryFixture);
    achievementFixture = module.get<AchievementFixture>(AchievementFixture);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('개인 달성 기록 리스트에 대한 페이지네이션 조회를 할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievements = [];
      for (let i = 0; i < 10; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category),
        );
      }

      // when
      const firstRequest = new PaginateAchievementRequest(category.id, 4);
      const firstResponse = await achievementService.getAchievements(
        user.id,
        firstRequest,
      );

      const nextRequest = new PaginateAchievementRequest(
        category.id,
        4,
        firstResponse.next.whereIdLessThan,
      );
      const nextResponse = await achievementService.getAchievements(
        user.id,
        nextRequest,
      );

      const lastRequest = new PaginateAchievementRequest(
        category.id,
        4,
        nextResponse.next.whereIdLessThan,
      );
      const lastResponse = await achievementService.getAchievements(
        user.id,
        lastRequest,
      );

      expect(firstResponse.count).toEqual(4);
      expect(firstResponse.data.length).toEqual(4);
      expect(firstResponse.next.whereIdLessThan).toEqual(7);

      expect(nextResponse.count).toEqual(4);
      expect(nextResponse.data.length).toEqual(4);
      expect(nextResponse.next.whereIdLessThan).toEqual(3);

      expect(lastResponse.count).toEqual(2);
      expect(lastResponse.data.length).toEqual(2);
      expect(lastResponse.next).toEqual(null);
    });
  });

  test('달성 기록 상세정보를 조회를 할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievements = [];
      for (let i = 0; i < 10; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category),
        );
      }
      // when
      const detail = await achievementService.getAchievementDetail(
        user.id,
        achievements[7].id,
      );

      expect(detail.id).toBeDefined();
      expect(detail.title).toBeDefined();
      expect(detail.content).toBeDefined();
      expect(detail.imageUrl).toBeDefined();
      expect(detail.category.id).toEqual(category.id);
      expect(detail.category.name).toEqual(category.name);
      expect(detail.category.achieveCount).toEqual(8);
    });
  });

  test('자신이 소유하지 않은 달성 기록 정보를 조회하면 NoSuchAchievementException을 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievements = [];
      for (let i = 0; i < 10; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category),
        );
      }
      // when
      // then
      await expect(
        achievementService.getAchievementDetail(
          user.id + 1,
          achievements[7].id,
        ),
      ).rejects.toThrow(NoSuchAchievementException);
    });
  });

  test('유효하지 않은 달성 기록 id를 통해 조회하면 NoSuchAchievementException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievements = [];
      for (let i = 0; i < 10; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category),
        );
      }
      // when
      // then
      await expect(
        achievementService.getAchievementDetail(
          user.id,
          achievements[9].id + 1,
        ),
      ).rejects.toThrow(NoSuchAchievementException);
    });
  });

  test('달성 기록을 soft delete 방식으로 삭제한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievement = await achievementFixture.getAchievement(
        user,
        category,
      );

      // when
      await achievementService.delete(user.id, achievement.id);

      // then
      const deleted = await achievementRepository.repository.findOne({
        where: { id: achievement.id },
        withDeleted: true,
      });

      expect(deleted.id).toEqual(achievement.id);
      expect(deleted.deletedAt).toBeDefined();
    });
  });

  test('soft delete 방식으로 삭제된 달성 기록을 삭제하면 NoSuchAchievementException을 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievement = await achievementFixture.getAchievement(
        user,
        category,
      );
      await achievementService.delete(user.id, achievement.id);

      // when
      // then
      await expect(
        achievementService.getAchievementDetail(user.id, achievement.id),
      ).rejects.toThrow(NoSuchAchievementException);
    });
  });

  test('존재하지 않는 달성 기록을 조회하면 NoSuchAchievementException을 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      // when
      // then
      await expect(
        achievementService.getAchievementDetail(1, 0),
      ).rejects.toThrow(NoSuchAchievementException);
    });
  });

  test('달성 기록을 수정한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category_1 = await categoryFixture.getCategory(user, 'ABC');
      const category_2 = await categoryFixture.getCategory(user, 'DEF');
      const image = await imageFixture.getImage(user);

      const achievement = await achievementFixture.getAchievement(
        user,
        category_1,
        image,
      );

      const request = new AchievementUpdateRequest(
        'update title',
        'update content',
        category_2.id,
      );

      // when
      await achievementService.update(user.id, achievement.id, request);

      // then
      const updated = await achievementRepository.findAchievementDetail(
        user.id,
        achievement.id,
      );
      console.log(user.id);
      console.log(achievement.id);

      const achievementEntities = await achievementRepository.repository.find(
        {},
      );
      console.log(achievementEntities);

      console.log(updated);
      expect(updated.category.id).toEqual(category_2.id);
      expect(updated.title).toEqual('update title');
      expect(updated.content).toEqual('update content');
    });
  });

  test('내 달성기록이 아닌 경우는 NoSuchAchievementException 예외를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category_1 = await categoryFixture.getCategory(user, 'ABC');
      const category_2 = await categoryFixture.getCategory(user, 'DEF');
      const achievement = await achievementFixture.getAchievement(
        user,
        category_1,
      );
      const request = new AchievementUpdateRequest(
        'update title',
        'update content',
        category_2.id,
      );

      // when
      // then
      await expect(
        achievementService.update(user.id + 1, achievement.id, request),
      ).rejects.toThrow(NoSuchAchievementException);
    });
  });

  test('내 카테고리가 아닌 경우 InvalidCategoryException 예외를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category_1 = await categoryFixture.getCategory(user, 'ABC');
      const category_2 = await categoryFixture.getCategory(user, 'DEF');
      const achievement = await achievementFixture.getAchievement(
        user,
        category_1,
      );
      const request = new AchievementUpdateRequest(
        'update title',
        'update content',
        category_2.id + 1,
      );

      // when
      // then
      await expect(
        achievementService.update(user.id, achievement.id, request),
      ).rejects.toThrow(InvalidCategoryException);
    });
  });

  describe('create는 achievement를 생성한다.', () => {
    it('성공적으로 생성하면 생성된 achievement를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, 'ABC');
        const image = await imageFixture.getImage(user);

        const request = new AchievementCreateRequest(
          'create title',
          'create content',
          category.id,
          image.id,
        );

        // when
        const response = await achievementService.create(user, request);

        // then
        expect(response.id).toBeDefined();
        expect(response.title).toEqual('create title');
        expect(response.content).toEqual('create content');
        expect(response.category.id).toEqual(category.id);
        expect(response.category.name).toEqual(category.name);
        expect(response.category.achieveCount).toEqual(1);
      });
    });

    it('내 카테고리가 아닌 경우 InvalidCategoryException 예외를 던진다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const otherUser = await usersFixture.getUser('DEF');
        const otherCategory = await categoryFixture.getCategory(otherUser);

        const user = await usersFixture.getUser('ABC');
        const image = await imageFixture.getImage(user);

        const request = new AchievementCreateRequest(
          'create title',
          'create content',
          otherCategory.id,
          image.id,
        );

        // when
        // then
        await expect(achievementService.create(user, request)).rejects.toThrow(
          InvalidCategoryException,
        );
      });
    });

    it('내 이미지가 아닌 경우 NoUserImageException 예외를 던진다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const otherUser = await usersFixture.getUser('DEF');
        const otherImage = await imageFixture.getImage(otherUser);

        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, 'ABC');

        const request = new AchievementCreateRequest(
          'create title',
          'create content',
          category.id,
          otherImage.id,
        );

        // when
        // then
        await expect(achievementService.create(user, request)).rejects.toThrow(
          NoUserImageException,
        );
      });
    });

    it('이미 사용된 이미지의 경우 NoUserImageException 예외를 던진다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, 'ABC');
        const image = await imageFixture.getImage(user);
        await achievementFixture.getAchievement(user, category, image);

        const imageEntity = await imageRepository.repository.find({
          where: { id: image.id },
          relations: ['achievement'],
        });
        console.log(imageEntity);

        // when
        // then
        await expect(
          achievementService.create(
            user,
            new AchievementCreateRequest(
              'create title',
              'create content',
              category.id,
              image.id,
            ),
          ),
        ).rejects.toThrow(NoUserImageException);
      });
    });
  });
});
