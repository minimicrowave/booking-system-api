import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  datetimeStart: Date;

  @Column({ type: 'datetime' })
  datetimeEnd: Date;

  @Column()
  userId: number;

  @Column()
  locationId: number;

  @ManyToOne(() => User, (user: User) => user.id, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Location, (location: Location) => location.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  constructor(
    datetimeStart: Date,
    datetimeEnd: Date,
    userId: number,
    locationId: number,
    id?: number,
  ) {
    this.datetimeStart = datetimeStart;
    this.datetimeEnd = datetimeEnd;
    this.userId = userId;
    this.locationId = locationId;
    this.id = id;
  }
}
