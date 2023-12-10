import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../entities/group.repository';

@Injectable()
export class GroupCodeGenerator {
  private readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  constructor(private groupRepository: GroupRepository) {}

  async generate() {
    let groupCode = this.makeGroupCode();

    while (await this.isDuplicate(groupCode)) {
      groupCode = this.makeGroupCode();
    }

    return groupCode;
  }

  private isDuplicate(groupCode: string): Promise<boolean> {
    return this.groupRepository.existByGroupCode(groupCode);
  }

  private makeGroupCode() {
    let groupCode = '';
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * this.CHARACTERS.length);
      groupCode += this.CHARACTERS.charAt(randomIndex);
    }
    return groupCode;
  }
}
