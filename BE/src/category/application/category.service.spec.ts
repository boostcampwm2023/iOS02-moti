import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { OperateModule } from '../../operate/operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { CategoryModule } from '../category.module';
import { CategoryService } from './category.service';
import { CategoryCreate } from '../dto/category-create';

describe('CategoryService', () => {
  let categoryService: CategoryService;
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
    categoryService = app.get<CategoryService>(CategoryService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('categoryService가 정의되어 있어야 한다.', () => {
      expect(categoryService).toBeDefined();
    });
  });

  it('saveCategory는 카테고리를 생성할 수 있다.', async () => {
    // given
    const user = await usersFixture.getUser(1);
    const categoryCreate = new CategoryCreate('카테고리1');

    // when
    const savedCategory = await categoryService.saveCategory(
      categoryCreate,
      user,
    );

    // then
    expect(savedCategory.name).toBe('카테고리1');
    expect(savedCategory.user).toStrictEqual(user);
  });
});
