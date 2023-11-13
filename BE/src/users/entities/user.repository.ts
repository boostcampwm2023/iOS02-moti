import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOneByUserIdentifier(userIdentifier: string) {
    return this.findOneBy({ userIdentifier: userIdentifier });
  }

  existByUserCode(userCode: string) {
    return this.exist({ where: { userCode: userCode } });
  }
}
