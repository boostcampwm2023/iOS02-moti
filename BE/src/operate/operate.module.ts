import { Module } from '@nestjs/common';
import { OperateController } from './controller/operate.controller';
import { OperateService } from './application/operate.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { MotiPolicyRepository } from './entities/moti-policy.repository';

@Module({
  controllers: [OperateController],
  providers: [OperateService],
  imports: [CustomTypeOrmModule.forCustomRepository([MotiPolicyRepository])],
})
export class OperateModule {}
