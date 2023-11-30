import { GroupPreview } from './group-preview.dto';

export class GroupListResponse {
  data: GroupPreview[];

  constructor(groupPreviews: GroupPreview[]) {
    this.data = groupPreviews;
  }
}
