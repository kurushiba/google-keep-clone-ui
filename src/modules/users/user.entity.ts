export class User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = new Date(user.createdAt);
    this.updatedAt = new Date(user.updatedAt);
  }
}
