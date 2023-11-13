import { UserRepository } from '../../users/entities/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCodeGenerator {
  private readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  constructor(private userRepository: UserRepository) {}

  async generate() {
    let userCode = this.makeUserCode();

    while (await this.isDuplicate(userCode)) {
      userCode = this.makeUserCode();
    }

    return userCode;
  }

  private isDuplicate(userCode: string): Promise<boolean> {
    return this.userRepository.existByUserCode(userCode);
  }

  private makeUserCode() {
    let userCode = '';
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * this.CHARACTERS.length);
      userCode += this.CHARACTERS.charAt(randomIndex);
    }
    return userCode;
  }
}
