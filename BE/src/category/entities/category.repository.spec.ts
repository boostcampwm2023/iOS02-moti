import { CategoryRepository } from './category.repository';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { OperateModule } from '../../operate/operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { CategoryModule } from '../category.module';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Category } from '../domain/category.domain';
import { UsersTestModule } from '../../../test/user/users-test.module';

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UsersTestModule,
        OperateModule,
        ConfigModule.forRoot(configServiceModuleOptions),
        CategoryModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    usersFixture = app.get<UsersFixture>(UsersFixture);
    categoryRepository = app.get<CategoryRepository>(CategoryRepository);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('categoryRepository가 정의되어 있어야 한다.', () => {
      expect(categoryRepository).toBeDefined();
    });
  });

  it('saveCategory는 카테고리를 생성할 수 있다.', async () => {
    // given
    const user = await usersFixture.getUser('ABC');
    const category = new Category(user, '카테고리1');

    // when
    const savedCategory = await categoryRepository.saveCategory(category);

    // then
    expect(savedCategory.name).toBe('카테고리1');
    expect(savedCategory.user).toEqual(user);
  });

  it('findById는 id로 user를 제외된 카테고리를 조회할 수 있다.', async () => {
    // given
    const user = await usersFixture.getUser(1);
    const category = new Category(user, '카테고리1');
    const savedCategory = await categoryRepository.saveCategory(category);

    // when
    const retrievedCategory = await categoryRepository.findById(
      savedCategory.id,
    );

    // then
    expect(retrievedCategory.name).toBe('카테고리1');
    expect(retrievedCategory.user).toBeUndefined();
  });
});
