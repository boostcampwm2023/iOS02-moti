import { DataSource, QueryRunner } from 'typeorm';
import { queryRunnerLocalStorage } from '../../src/config/transaction-manager';

export const transactionTest = async (
  dataSource: DataSource,
  test: () => Promise<any>,
): Promise<any> => {
  const runner: QueryRunner = dataSource.createQueryRunner();
  await runner.startTransaction();
  await queryRunnerLocalStorage.run({ queryRunner: runner }, async () => {
    try {
      await test();
    } finally {
      await runner.rollbackTransaction();
      await runner.release();
    }
  });
};
