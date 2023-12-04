import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../entities/user.repository';
import { Transactional } from '../../config/transaction-manager';
import { User } from '../domain/user.domain';
import { InvalidRejectRequestException } from '../../group/achievement/exception/invalid-reject-request.exception';
import { UserBlockedUserRepository } from '../entities/user-blocked-user.repository';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';
import { NoSuchUserException } from '../exception/no-such-user.exception';
import { RejectUserResponse } from '../dto/reject-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersRepository: UserRepository,
    private readonly userBlockedUserRepository: UserBlockedUserRepository,
  ) {}

  @Transactional({ readonly: true })
  async findOneByUserCode(userCode: string): Promise<User> {
    return await this.usersRepository.findOneByUserCode(userCode);
  }

  @Transactional({ readonly: true })
  async getUserByUserCodeWithRoles(userCode: string): Promise<User> {
    return await this.usersRepository.findOneByUserCodeWithRoles(userCode);
  }

  @Transactional()
  async reject(user: User, userCode: string) {
    const blockedUser = await this.usersRepository.findOneByUserCode(userCode);
    if (!blockedUser) throw new NoSuchUserException();
    if (blockedUser.id === user.id) throw new InvalidRejectRequestException();
    const userBlockedUser =
      await this.userBlockedUserRepository.saveUserBlockedUser(
        new UserBlockedUser(user, blockedUser),
      );
    return RejectUserResponse.from(userBlockedUser);
  }
}
