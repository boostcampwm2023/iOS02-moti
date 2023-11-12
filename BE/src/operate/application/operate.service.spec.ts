import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { OperateModule } from '../operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { OperateService } from './operate.service';
import { MotiPolicyCreate } from '../dto/moti-policy-create';
import { DataSource, QueryRunner } from 'typeorm';
import { MotimateException } from '../../common/exception/motimate.excpetion';

describe('OperateService Test', () => {
  let operateService: OperateService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        OperateModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
    }).compile();

    operateService = app.get<OperateService>(OperateService);
    dataSource = app.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  afterAll(async () => {
    await queryRunner.release();
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('operateService가 정의되어 있어야 한다.', () => {
      expect(operateService).toBeDefined();
    });
  });

  it('initMotiPolicy는 모티메이트 운영정책을 초기화한다.', async () => {
    // given
    const initialPolicy = new MotiPolicyCreate(
      '0.2.0',
      '0.1.0',
      'https://motimate.com/policy',
    );

    // when
    const motiPolicy = await operateService.initMotiPolicy(initialPolicy);

    // then
    expect(motiPolicy).toBeDefined();
    expect(motiPolicy.latest).toBe('0.2.0');
    expect(motiPolicy.required).toBe('0.1.0');
    expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy');
  });

  it('initMotiPolicy는 모티메이트 운영정책을 초기화할 때, 이미 초기화된 상태에서 MotimateException을 발생시킨다.', async () => {
    // given
    const initialPolicy = new MotiPolicyCreate(
      '0.2.0',
      '0.1.0',
      'https://motimate.com/policy',
    );
    await operateService.initMotiPolicy(initialPolicy);

    // when
    // then
    try {
      await operateService.initMotiPolicy(initialPolicy);
    } catch (e) {
      expect(e).toBeInstanceOf(MotimateException);
      expect(e.status).toBe(500);
      expect(e.message).toBe('이미 초기화된 모티메이트 운영정책입니다.');
    }
  });

  it('retrieveMotimateOperation는 모티메이트 운영정책이 없을 때 MotimateException을 발생시킨다.', async () => {
    // given
    // when
    // then
    try {
      await operateService.retrieveMotimateOperation();
    } catch (e) {
      expect(e).toBeInstanceOf(MotimateException);
      expect(e.status).toBe(500);
      expect(e.message).toBe('운영정책을 조회할 수 없습니다.');
    }
  });

  it('retrieveMotimateOperation는 모티메이트 운영정책을 조회한다.', async () => {
    // given
    const initialPolicy = new MotiPolicyCreate(
      '0.2.0',
      '0.1.0',
      'https://motimate.com/policy',
    );
    await operateService.initMotiPolicy(initialPolicy);

    // when
    const motiPolicy = await operateService.retrieveMotimateOperation();
    // then
    expect(motiPolicy).toBeDefined();
    expect(motiPolicy.latest).toBe('0.2.0');
    expect(motiPolicy.required).toBe('0.1.0');
    expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy');
  });
});
