export class Group {
  id: number;
  name: string;
  avatarUrl: string;

  constructor(name: string, avatarUrl: string) {
    this.name = name;
    this.avatarUrl = avatarUrl;
  }
}
