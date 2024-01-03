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
import { RejectUserListResponse } from '../dto/reject-user-list-response.dto';
import { InvalidAllowRequestException } from '../exception/invalid-allow-request.exception';
import { AllowUserResponse } from '../dto/allow-user-response.dto';

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
  @Transactional()
  async allow(user: User, userCode: string) {
    const blockedUser = await this.usersRepository.findOneByUserCode(userCode);
    if (!blockedUser) throw new NoSuchUserException();
    const userBlockedUser =
      await this.userBlockedUserRepository.findByUserIdAndBlockedUserCode(
        user.id,
        userCode,
      );
    if (!userBlockedUser) throw new InvalidAllowRequestException();
    await this.userBlockedUserRepository.deleteByUserIdAndBlockedUserId(
      user.id,
      blockedUser.id,
    );
    return AllowUserResponse.from(userBlockedUser);
  }

  @Transactional({ readonly: true })
  async getRejectUserList(user: User) {
    const userBlockedUsers =
      await this.userBlockedUserRepository.findByUserIdWithBlockedUser(user.id);
    return new RejectUserListResponse(userBlockedUsers);
  }
}
