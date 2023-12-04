import { IGroupUserInfo } from '../index';
import { dateFormat } from '../../common/utils/date-formatter';

export class GroupUserInfo {
  avatarUrl: string;
  grade: string;
  lastChallenged: string;
  userCode: string;
  constructor(groupUserInfo: IGroupUserInfo) {
    this.avatarUrl = groupUserInfo.avatarUrl;
    this.grade = groupUserInfo.grade;
    this.lastChallenged = dateFormat(groupUserInfo.lastChallenged);
    this.userCode = groupUserInfo.userCode;
  }
}
