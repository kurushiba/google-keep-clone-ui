export class Label {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;

  constructor(label: any) {
    this.id = label.id;
    this.userId = label.userId;
    this.name = label.name;
    this.color = label.color;
    this.createdAt = new Date(label.createdAt);
  }
}
