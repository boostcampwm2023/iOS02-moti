import { DiscoveryModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';

@Module({
  imports: [DiscoveryModule],
  providers: [TransactionManager],
})
export class TransactionModule {}
