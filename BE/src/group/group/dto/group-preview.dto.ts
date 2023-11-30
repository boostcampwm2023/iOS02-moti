import { IGroupPreview } from '../index';
import { dateFormat } from '../../../common/utils/date-formatter';

export class GroupPreview {
  id: number;
  name: string;
  avatarUrl: string;
  continued: number;
  lastChallenged: string;

  constructor(groupPreview: IGroupPreview) {
    this.id = groupPreview.id;
    this.name = groupPreview.name;
    this.avatarUrl = groupPreview.avatarUrl;
    this.continued = parseInt(groupPreview.continued);
    this.lastChallenged = dateFormat(groupPreview.lastChallenged);
  }
}
