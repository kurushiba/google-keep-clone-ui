import { Label } from '../labels/label.entity';

export class Note {
  id: string;
  userId: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  labels: Label[];

  constructor(note: any) {
    this.id = note.id;
    this.userId = note.userId;
    this.title = note.title;
    this.content = note.content;
    this.imageUrl = note.imageUrl;
    this.createdAt = new Date(note.createdAt);
    this.updatedAt = new Date(note.updatedAt);
    this.labels = note.labels ? note.labels.map((label: any) => new Label(label)) : [];
  }
}
