import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  constructor(username: string, password: string, id?: number) {
    this.username = username;
    this.password = password;
    this.id = id;
  }
}
