import { Test, TestingModule } from '@nestjs/testing';
import { OperateService } from './operate.service';
import { MotiPolicyCreate } from '../dto/moti-policy-create';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { OperateModule } from '../operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { DataSource } from 'typeorm';
import { transactionTest } from '../../../test/common/transaction-test';
import { PolicyNotFoundException } from '../exception/policy-not-found.exception';
import { MotimateException } from '../../common/exception/motimate.excpetion';
import { MotiPolicyUpdate } from '../dto';
import { MotiPolicyIdempotentUpdate } from '../dto/moti-policy-idempotent-update';

describe('OperateService Test', () => {
  let operateService: OperateService;
  let dataSource: DataSource;

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
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('operateService가 정의되어 있어야 한다.', () => {
      expect(operateService).toBeDefined();
    });
  });

  it('initMotiPolicy는 모티메이트 운영정책을 초기화한다.', async () => {
    await transactionTest(dataSource, async () => {
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
  });

  it('initMotiPolicy는 모티메이트 운영정책을 초기화할 때, 이미 초기화된 상태에서 MotimateException을 발생시킨다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const initialPolicy = new MotiPolicyCreate(
        '0.2.0',
        '0.1.0',
        'https://motimate.com/policy',
      );
      await operateService.initMotiPolicy(initialPolicy);

      // when
      // then
      await expect(
        operateService.initMotiPolicy(initialPolicy),
      ).rejects.toThrow(MotimateException);
    });
  });

  it('retrieveMotimateOperation는 모티메이트 운영정책이 없을 때 MotimateException을 발생시킨다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      // when
      // then
      await expect(operateService.retrieveMotimateOperation()).rejects.toThrow(
        PolicyNotFoundException,
      );
    });
  });

  it('retrieveMotimateOperation는 모티메이트 운영정책을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
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

  describe('updateMotiPolicy는 모티메이트 운영정책을 업데이트한다.', () => {
    it('updatePolicy가 인터페이스 형태로 운영정책을 업데이트할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const initialPolicy = new MotiPolicyCreate(
          '0.2.0',
          '0.1.0',
          'https://motimate.com/policy',
        );
        await operateService.initMotiPolicy(initialPolicy);

        // when
        const updatePolicy: MotiPolicyUpdate = {
          latest: '0.3.0',
          required: '0.2.0',
        };
        const motiPolicy = await operateService.updateMotiPolicy(updatePolicy);

        // then
        expect(motiPolicy).toBeDefined();
        expect(motiPolicy.latest).toBe('0.3.0');
        expect(motiPolicy.required).toBe('0.2.0');
        expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy');
      });
    });

    it('updatePolicy가 MotiPolicyIdempotentUpdate로 멱등적으로 운영정책을 업데이트할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const initialPolicy = new MotiPolicyCreate(
          '0.2.0',
          '0.1.0',
          'https://motimate.com/policy',
        );
        await operateService.initMotiPolicy(initialPolicy);

        // when
        const updatePolicy: MotiPolicyIdempotentUpdate =
          new MotiPolicyIdempotentUpdate(
            '0.4.0',
            '0.3.0',
            'https://motimate.com/policy2',
          );
        const motiPolicy = await operateService.updateMotiPolicy(updatePolicy);

        // then
        expect(motiPolicy).toBeDefined();
        expect(motiPolicy.latest).toBe('0.4.0');
        expect(motiPolicy.required).toBe('0.3.0');
        expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy2');
      });
    });

    it('updatePolicy가 MotiPolicyPartialUpdate로 부분적으로 운영정책을 업데이트할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const initialPolicy = new MotiPolicyCreate(
          '0.5.0',
          '0.1.0',
          'https://motimate.com/policy',
        );
        await operateService.initMotiPolicy(initialPolicy);

        // when
        const updatePolicy: MotiPolicyIdempotentUpdate =
          new MotiPolicyIdempotentUpdate(
            undefined,
            '0.3.0',
            'https://motimate.com/policy2',
          );
        const motiPolicy = await operateService.updateMotiPolicy(updatePolicy);

        // then
        expect(motiPolicy).toBeDefined();
        expect(motiPolicy.latest).toBe('0.5.0');
        expect(motiPolicy.required).toBe('0.3.0');
        expect(motiPolicy.privacyPolicy).toBe('https://motimate.com/policy2');
      });
    });

  });
});
