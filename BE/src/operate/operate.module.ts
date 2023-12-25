import { Module } from '@nestjs/common';
import { OperateController } from './controller/operate.controller';
import { OperateService } from './application/operate.service';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { MotiPolicyRepository } from './entities/moti-policy.repository';
import { OperateMvcController } from './controller/operate-mvc.controller';
import { UserRepository } from '../users/entities/user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [OperateController, OperateMvcController],
  providers: [OperateService],
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      MotiPolicyRepository,
      UserRepository,
    ]),
    AuthModule,
  ],
})
export class OperateModule {}
