import { Type } from 'class-transformer';

export class CreateBookingDto {
  userId: number;

  locationId: number;

  @Type(() => Date)
  datetimeStart: Date;

  @Type(() => Date)
  datetimeEnd: Date;

  public constructor(init?: Partial<CreateBookingDto>) {
    Object.assign(this, init);
  }
}
