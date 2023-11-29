import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupRepository } from './entities/group.repository';
import { GroupService } from './application/group.service';
import { UserGroupRepository } from './entities/user-group.repository';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupRepository,
      UserGroupRepository,
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
