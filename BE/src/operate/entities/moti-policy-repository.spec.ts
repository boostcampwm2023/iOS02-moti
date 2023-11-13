import { Test, TestingModule } from '@nestjs/testing';
import { MotiPolicyRepository } from './moti-policy.repository';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { OperateModule } from '../operate.module';
import { configServiceModuleOptions } from '../../config/config';
import { MotiPolicy } from '../domain/moti-policy.domain';
import { DataSource } from 'typeorm';
import { transactionTest } from '../../../test/common/transaction-test';

describe('MotiPolicyRepository Test', () => {
  let motiPolicyRepository: MotiPolicyRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        OperateModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
      controllers: [],
      providers: [],
    }).compile();

    motiPolicyRepository = app.get<MotiPolicyRepository>(MotiPolicyRepository);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('motiPolicyRepository가 정의되어 있어야 한다.', () => {
      expect(motiPolicyRepository).toBeDefined();
    });
  });

  test('savePolicy는 모티메이트 운영정책을 초기화한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const initialPolicy = new MotiPolicy(
        '0.2.0',
        '0.1.0',
        'https://motimate.com/policy',
      );
      await motiPolicyRepository.savePolicy(initialPolicy);

      // when
      const motiPolicy = await motiPolicyRepository.findLatestPolicy();

      // then
      expect(motiPolicy).toBeDefined();
      expect(motiPolicy.latest).toBe('0.2.0');
      expect(motiPolicy.required).toBe('0.1.0');
      expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy');
    });
  });

  test('findLatestPolicy는 가장 최근의 애플리케이션 규약을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const initialPolicy = new MotiPolicy(
        '0.2.0',
        '0.1.0',
        'https://motimate.com/policy',
      );
      await motiPolicyRepository.savePolicy(initialPolicy);

      // when
      const motiPolicy = await motiPolicyRepository.findLatestPolicy();

      // then
      expect(motiPolicy).toBeDefined();
      expect(motiPolicy.latest).toBe('0.2.0');
      expect(motiPolicy.required).toBe('0.1.0');
      expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy');
    });
  });

  test('fincLatestPolicy는 초기화되지 않은 상태에서 undefined을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      // when
      const motiPolicy = await motiPolicyRepository.findLatestPolicy();

      // then
      expect(motiPolicy).toBeUndefined();
    });
  });
});
