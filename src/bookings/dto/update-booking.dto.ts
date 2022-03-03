import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends CreateBookingDto {
  id: number;

  public constructor(init?: Partial<UpdateBookingDto>) {
    super(init);
    Object.assign(this, init);
  }
}
