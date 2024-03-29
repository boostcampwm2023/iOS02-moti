import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { GroupRepository } from './entities/group.repository';
import { GroupService } from './application/group.service';
import { UserGroupRepository } from './entities/user-group.repository';
import { GroupAvatarHolder } from './application/group-avatar.holder';
import { UserRepository } from '../../users/entities/user.repository';
import { GroupCodeGenerator } from './application/group-code-generator';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      GroupRepository,
      UserRepository,
      UserGroupRepository,
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupAvatarHolder, GroupCodeGenerator],
  exports: [GroupService],
})
export class GroupModule {}
