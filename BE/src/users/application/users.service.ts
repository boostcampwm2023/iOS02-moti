import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../entities/user.repository';
import { Transactional } from '../../config/transaction-manager';
import { User } from '../domain/user.domain';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersRepository: UserRepository,
  ) {}

  @Transactional()
  async findOneByUserCode(userCode: string): Promise<User> {
    return await this.usersRepository.findOneByUserCode(userCode);
  }
}
