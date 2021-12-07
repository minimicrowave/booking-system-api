import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { datetimeStart, datetimeEnd, userId, locationId } = createBookingDto;
    const isAvailable = await this.isAvailable(
      locationId,
      datetimeStart,
      datetimeEnd,
    );
    if (!isAvailable) {
      throw new BadRequestException();
    }

    const booking = new Booking(datetimeStart, datetimeEnd, userId, locationId);

    await this.bookingsRepository.save(booking);
  }

  findByUserId(userId: number) {
    return this.bookingsRepository.find({
      where: {
        userId,
      },
    });
  }

  findByDateRangeAndLocation(
    locationId: number,
    datetimeStart: Date,
    datetimeEnd: Date,
  ) {
    return this.bookingsRepository.find({
      where: {
        locationId,
        datetimeStart: Between(datetimeStart, datetimeEnd),
        datetimeEnd: Between(datetimeStart, datetimeEnd),
      },
      relations: ['location'],
    });
  }

  findOne(id: number) {
    return this.bookingsRepository.findOne({ id });
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }

  async isAvailable(
    locationId: number,
    datetimeStart: Date,
    datetimeEnd: Date,
  ) {
    return (
      // check for overlapping bookings
      (
        await this.bookingsRepository.find({
          where: {
            locationId,
            datetimeStart: LessThan(datetimeEnd),
            datetimeEnd: MoreThan(datetimeStart),
          },
        })
      ).length === 0
    );
  }
}
