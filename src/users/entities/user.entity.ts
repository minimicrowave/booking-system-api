import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  constructor(username: string, password: string, id?: number) {
    this.username = username;
    this.password = password;
    this.id = id;
  }
}
